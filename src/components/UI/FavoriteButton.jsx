// movie-database/src/components/UI/FavoriteButton.jsx
import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { supabase } from '../../lib/supabaseClient';

const FavoriteButton = ({ movieId, userId, onToggleFavorite }) => {
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !movieId) return;
    const fetchFavoriteStatus = async () => {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .match({ movie_id: movieId, user_id: userId })
        .single();
      
      if (error) {
        // Si no encuentra registro, se interpreta como no favorited
        console.error('Error fetching favorite status:', error);
        setFavorited(false);
      } else if (data) {
        setFavorited(true);
      } else {
        setFavorited(false);
      }
      setLoading(false);
    };

    fetchFavoriteStatus();
  }, [userId, movieId]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (!userId || !movieId) return;
    if (favorited) {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .match({ movie_id: movieId, user_id: userId });
      if (error) {
        console.error('Error deleting favorite:', error);
      } else {
        setFavorited(false);
        if (onToggleFavorite) onToggleFavorite(); // Llama el callback para actualizar la lista
      }
    } else {
      const { error } = await supabase
        .from('user_favorites')
        .insert([{ movie_id: movieId, user_id: userId }]);
      if (error) {
        console.error('Error inserting favorite:', error);
      } else {
        setFavorited(true);
        if (onToggleFavorite) onToggleFavorite(); // Llama el callback para actualizar la lista
      }
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className="absolute bottom-4 right-4 text-3xl text-yellow-300 hover:text-yellow-400 transition-colors"
    >
      {favorited ? <FaHeart /> : <FaRegHeart />}
    </button>
  );
};

export default FavoriteButton;
