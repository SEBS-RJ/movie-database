// movie-database/src/components/Movies/SimilarMovies.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router-dom'; // Asegúrate de tener configurado react-router-dom
import Loader from '../UI/Loader';

const SimilarMovies = ({ currentMovieId, currentGenres }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarMovies = async () => {
        setLoading(true);
        try {
          let query = supabase
            .from('movies')
            .select('*')
            .neq('id', currentMovieId);
          
          if (currentGenres && currentGenres.length > 0) {
            query = query.overlap('genre', currentGenres);
          }
          
          query = query.order('rating', { ascending: false });
          const { data, error } = await query;
          if (error) {
            console.error('Error fetching similar movies:', error);
          } else {
            setMovies(data);
          }
        } catch (err) {
          console.error("Error in fetchSimilarMovies: ", err);
        } finally {
          setLoading(false);
        }
      };     

    if (currentGenres && currentGenres.length > 0) {
      fetchSimilarMovies();
    } else {
      setLoading(false);
    }
  }, [currentMovieId, currentGenres]);

  if (loading) return <Loader />;
  if (!movies || movies.length === 0) {
    return <p className="text-gray-400 mt-4"></p>;
  }

  return (
    <div className="similar-movies mt-8">
      <h3 className="text-2xl font-bold mb-4">Películas Similares</h3>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {movies.map(movie => (
          <Link key={movie.id} to={`/movies/${movie.id}`}>
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-32 h-auto rounded hover:opacity-75 transition-opacity"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarMovies;
