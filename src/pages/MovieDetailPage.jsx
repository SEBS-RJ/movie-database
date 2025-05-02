// movie-database/src/pages/MovieDetailPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import MovieDetails from '../components/Movies/MovieDetails';
import Loader from '../components/UI/Loader';
import { supabase } from '../lib/supabaseClient';
import AuthContext from '../context/authContext';

const MovieDetailPage = () => {
  const { id: movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .eq('id', movieId)
          .single();
        if (error) {
          console.error("Error al cargar los detalles:", error);
        } else {
          setMovie(data);
        }
      } catch (err) {
        console.error("Excepción al cargar los detalles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  return (
    <div className="movie-detail-page">
      {loading ? (
        <Loader />
      ) : movie ? (
        // Se renderizan todos los detalles, incluyendo el favorito,
        // la descripción, el tráiler debajo de la descripción, y la sección de comentarios 
        // (con estrellas, respuestas, edición y eliminación según corresponda).
        <MovieDetails movie={movie} user={user} />
      ) : (
        <p className="text-gray-400">Película no encontrada.</p>
      )}
    </div>
  );
};

export default MovieDetailPage;
