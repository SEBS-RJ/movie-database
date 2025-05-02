// movie-database/src/components/Reviews/ReviewForm.jsx
import React, { useState, useContext } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AuthContext from '../context/authContext';
import Button from '../UI/Button';
import StarRating from '../UI/StarRating';

const ReviewForm = ({ movieId, onReviewAdded }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0); // valor entre 0 y 10
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!user) {
      setError('Debes iniciar sesión para publicar un comentario.');
      return; 
    }
    if (!rating || !comment.trim()) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('reviews').insert([
      { movie_id: movieId, user_id: user.id, rating, comment }
    ]);
    if (error) {
      console.error('Error al enviar comentario:', error);
      setError(error.message);
    } else {
      setSuccess('Comentario enviado exitosamente.');
      setRating(0);
      setComment('');
      if (onReviewAdded) onReviewAdded();
    }
    setLoading(false);
  };

  return (
    <div className="review-form mb-4">
      <h3 className="text-2xl font-bold mb-2">Añadir Comentario</h3>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleReviewSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Calificación:</label>
          <StarRating
          rating={rating / 2} // Si rating está en escala 0-10, se muestra la mitad
          onChange={(newVal) => setRating(newVal * 2)}
          max={5}/>
          <p>{rating.toFixed(1)}/10</p>
        </div>
        <div>
          <label className="block mb-1">Comentario:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 bg-gray-900 text-yellow-300 rounded border border-gray-700"
            rows="3"
          ></textarea>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Comentario'}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
