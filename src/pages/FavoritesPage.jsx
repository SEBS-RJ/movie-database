// movie-database/src/pages/FavoritesPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
import Loader from '../components/UI/Loader';
import MovieCard from '../components/Movies/MovieCard';
import AuthContext from '../context/authContext';

const FavoritesPage = () => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Un contador para forzar la actualización de favoritos
  const [refreshKey, setRefreshKey] = useState(0);

  // Función para consultar favoritos
  const fetchFavorites = async () => {
    setLoading(true);
    if (user) {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('movie:movie_id(*)')
        .eq('user_id', user.id);
      if (error) console.error('Error al obtener favoritos:', error);
      else setFavorites(data.map(item => item.movie));
    }
    setLoading(false);
  };

  // Se ejecuta la consulta cuando el usuario cambia o cuando refreshKey cambia.
  useEffect(() => {
    fetchFavorites();
  }, [user, refreshKey]);

  // Callback que se invoca cuando se quita un favorito en MovieCard
  const handleFavoriteToggle = () => {
    // Incrementamos el refreshKey para reejecutar el useEffect y actualizar la lista.
    setRefreshKey(prev => prev + 1);
  };

  if (loading) return <Loader />;

  return (
    <div className="favorites-page container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Mis Favoritos</h2>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map(movie => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              user={user} 
              onFavoriteToggle={handleFavoriteToggle} // Se pasa el callback
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No tienes películas favoritas.</p>
      )}
    </div>
  );
};

export default FavoritesPage;
