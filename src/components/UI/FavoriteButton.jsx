// movie-database/src/components/UI/FavoriteButton.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const FavoriteButton = ({ movieId, userId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('movie_id', movieId)
        .single();

      if (data) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
      if (error && error.code !== 'PGRST116') {
        console.error("Error consultando el estado de favorito:", error);
      }
    };

    if (userId && movieId) {
      fetchFavoriteStatus();
    }
  }, [movieId, userId]);

  const toggleFavorite = async () => {
    setLoading(true);
    if (isFavorite) {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('movie_id', movieId);

      if (error) {
        console.error("Error al quitar de favoritos:", error);
      } else {
        setIsFavorite(false);
      }
    } else {
      const { error } = await supabase
        .from('user_favorites')
        .insert([{ user_id: userId, movie_id: movieId }]);

      if (error) {
        console.error("Error al agregar a favoritos:", error);
      } else {
        setIsFavorite(true);
      }
    }
    setLoading(false);
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg ${
        isFavorite ? 'bg-red-500' : 'bg-yellow-300'
      } text-gray-900 hover:opacity-90 transition`}
      onClick={toggleFavorite}
      disabled={loading}
    >
      {loading ? 'Procesando...' : isFavorite ? 'Quitar' : 'Favorito'}
    </button>
  );
};

export default FavoriteButton;


