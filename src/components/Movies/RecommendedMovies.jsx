// movie-database/src/components/Movies/RecommendedMovies.jsx
import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Loader from '../UI/Loader';
import { AuthContext } from '../../context/authContext';
import { Link } from 'react-router-dom';

const RecommendedMovies = () => {
  const { user } = useContext(AuthContext);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendedMovies = async () => {
    if (!user) return;

    setLoading(true);

    // Obtener favoritos del usuario (suponiendo que tienes una tabla "favorites" con columnas: user_id, movie_id)
    const { data: favorites, error: favError } = await supabase
      .from('favorites')
      .select('movie_id')
      .eq('user_id', user.id);
    if (favError) {
      console.error('Error al obtener favoritos:', favError);
      setLoading(false);
      return;
    }

    // Si no tiene favoritos, se muestra un fallback con películas populares por rating
    if (!favorites || favorites.length === 0) {
      const { data: popularMovies, error: popError } = await supabase
        .from('movies')
        .select('*')
        .order('rating', { ascending: false })
        .limit(6);
      if (popError) {
        console.error('Error al obtener películas populares:', popError);
      } else {
        setRecommended(popularMovies);
      }
      setLoading(false);
      return;
    }

    // Extraer los IDs de las películas favoritas
    const favoriteIds = favorites.map(fav => fav.movie_id);

    // Obtener los géneros de las películas favoritas
    const { data: favoriteMovies, error: favMoviesError } = await supabase
      .from('movies')
      .select('genre')
      .in('id', favoriteIds);
    if (favMoviesError) {
      console.error('Error al obtener películas favoritas:', favMoviesError);
      setLoading(false);
      return;
    }

    // Generar un array único de géneros a partir de las películas favoritas
    let recommendedGenres = [];
    favoriteMovies.forEach(movie => {
      if (movie.genre && Array.isArray(movie.genre)) {
        movie.genre.forEach(g => {
          if (!recommendedGenres.includes(g)) {
            recommendedGenres.push(g);
          }
        });
      }
    });

    // Consultar películas que compartan alguno de esos géneros y excluir las ya favoritas
    const { data: recMovies, error: recError } = await supabase
      .from('movies')
      .select('*')
      .overlap('genre', recommendedGenres)
      .not('id', 'in', `(${favoriteIds.join(',')})`)
      .order('rating', { ascending: false })
      .limit(6);
    if (recError) {
      console.error('Error al obtener recomendaciones:', recError);
    } else {
      setRecommended(recMovies);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecommendedMovies();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div className="recommended-movies mt-8">
      <h3 className="text-2xl font-bold mb-4">Películas que te pueden gustar</h3>
      {recommended && recommended.length > 0 ? (
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {recommended.map(movie => (
            <Link key={movie.id} to={`/movies/${movie.id}`}>
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-32 h-auto rounded hover:opacity-75 transition"
              />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No se encontraron recomendaciones.</p>
      )}
    </div>
  );
};

export default RecommendedMovies;
