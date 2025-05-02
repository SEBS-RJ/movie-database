// movie-database/src/components/Reviews/ReviewReplies.jsx
import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Loader from '../UI/Loader';
import Button from '../UI/Button';
import AuthContext from '../context/authContext';

const ReviewReplies = ({ reviewId }) => {
  const { user } = useContext(AuthContext);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');

  const fetchReplies = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('review_replies')
      .select('*')
      .eq('review_id', reviewId)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching replies:', error);
    } else {
      console.log("Respuestas obtenidas:", data);
      setReplies(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReplies();
  }, [reviewId]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!user) {
      setError('Debes iniciar sesión para responder.');
      return;
    }
    if (!replyText.trim()) {
      setError('El mensaje no puede estar vacío.');
      return;
    }
    // Intentamos insertar la respuesta
    const { data, error } = await supabase
      .from('review_replies')
      .insert([{ review_id: reviewId, user_id: user.id, comment: replyText }]);
    if (error) {
      console.error('Error al enviar respuesta:', error);
      setError(error.message);
    } else {
      console.log("Respuesta enviada:", data);
      setReplyText('');
      // Refrescamos las respuestas
      fetchReplies();
    }
  };

  return (
    <div className="review-replies ml-4 mt-2">
      {loading && <Loader />}
      {replies.length > 0 && (
        <ul>
          {replies.map(reply => (
            <li key={reply.id} className="mb-2 bg-gray-700 p-2 rounded">
              <p>{reply.comment}</p>
              <p className="text-sm text-gray-300">
                {reply.user_id} – {new Date(reply.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleReplySubmit} className="mt-2">
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          placeholder="Responder..."
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="w-full p-2 bg-gray-800 text-yellow-300 rounded border border-gray-700"
        />
        <Button type="submit" className="mt-2">
          Enviar Respuesta
        </Button>
      </form>
    </div>
  );
};

export default ReviewReplies;
