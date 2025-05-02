// movie-database/src/components/Reviews/ReviewList.jsx
import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Loader from '../UI/Loader';
import { AuthContext } from '../../context/authcontext';
import Button from '../UI/Button';
import ReviewReplies from './ReviewReplies';

const ReviewList = ({ movieId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    // Se actualiza el select usando el alias correcto (en este caso, user_profiles)
    const { data, error } = await supabase
      .from('reviews')
      .select('*', 'user_profiles!reviews_user_id_fkey ( username, avatar_url )')
      .eq('movie_id', movieId)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching reviews:', error);
    } else {
      console.log("Comentarios obtenidos:", data);
      setReviews(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();

    // Suscripción en tiempo real para nuevos inserts de comentarios
    const subscription = supabase
      .channel('review-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reviews', filter: `movie_id=eq.${movieId}` },
        (payload) => {
          setReviews(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [movieId]);

  const handleDelete = async (reviewId) => {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
    if (error) {
      console.error('Error deleting review:', error);
    } else {
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    }
  };

  const handleEdit = async (reviewId, newRating, newComment) => {
    const { error } = await supabase.from('reviews').update({ rating: newRating, comment: newComment }).eq('id', reviewId);
    if (error) {
      console.error('Error updating review:', error);
    } else {
      setReviews(prev =>
        prev.map(r => (r.id === reviewId ? { ...r, rating: newRating, comment: newComment } : r))
      );
    }
  };

  const handleLike = async (review) => {
    const newLikes = (review.likes || 0) + 1;
    const { error } = await supabase.from('reviews').update({ likes: newLikes }).eq('id', review.id);
    if (error) {
      console.error('Error liking review:', error);
    } else {
      setReviews(prev =>
        prev.map(r => (r.id === review.id ? { ...r, likes: newLikes } : r))
      );
    }
  };

  // Componente interno para cada comentario, con modo edición
  const ReviewItem = ({ review }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editRating, setEditRating] = useState(review.rating);
    const [editComment, setEditComment] = useState(review.comment);

    return (
      <li className="mb-4 bg-gray-800 p-4 rounded">
        {isEditing ? (
          <div>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={editRating}
              onChange={(e) => setEditRating(e.target.value)}
              className="p-1 bg-gray-900 text-yellow-300 rounded border border-gray-700 mr-2"
            />
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              className="p-1 bg-gray-900 text-yellow-300 rounded border border-gray-700 w-full mb-2"
              rows="2"
            ></textarea>
            <Button onClick={() => { handleEdit(review.id, editRating, editComment); setIsEditing(false); }}>
              Guardar
            </Button>
            <Button onClick={() => setIsEditing(false)} className="ml-2">
              Cancelar
            </Button>
          </div>
        ) : (
          <div>
            <p className="mb-1"><strong>Rating:</strong> {review.rating}/10</p>
            <p className="mb-1">{review.comment}</p>
            <p className="text-sm text-gray-400">
              Por: {review.user_profiles ? review.user_profiles.username : review.user_id} – {new Date(review.created_at).toLocaleString()}
            </p>
            <div className="flex items-center mt-2">
              <Button onClick={() => handleLike(review)}>Me Gusta ({review.likes || 0})</Button>
              {user && user.id === review.user_id && (
                <>
                  <Button onClick={() => setIsEditing(true)} className="ml-2">
                    Editar
                  </Button>
                  <Button onClick={() => handleDelete(review.id)} className="ml-2">
                    Eliminar
                  </Button>
                </>
              )}
            </div>
            <ReviewReplies reviewId={review.id} />
          </div>
        )}
      </li>
    );
  };

  if (loading) return <Loader />;
  if (!reviews || reviews.length === 0)
    return <p className="text-gray-400">No hay comentarios para esta película.</p>;

  return (
    <div className="review-list mt-4">
      <h3 className="text-2xl font-bold mb-2">Comentarios</h3>
      <ul>
        {reviews.map(review => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;
