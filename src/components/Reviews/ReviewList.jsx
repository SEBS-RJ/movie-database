// movie-database/src/components/Reviews/ReviewList.jsx
import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Loader from '../UI/Loader';
import AuthContext from '../../context/authContext';
import Button from '../UI/Button';
import ReviewReplies from './ReviewReplies';
import { FaThumbsUp, FaThumbsDown, FaPencilAlt, FaMinusCircle } from 'react-icons/fa';
/* eslint-disable-next-line no-unused-vars */
import { motion } from 'framer-motion';

const ReviewList = ({ movieId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
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
    const { error } = await supabase
      .from('reviews')
      .update({ rating: newRating, comment: newComment })
      .eq('id', reviewId);
    if (error) {
      console.error('Error updating review:', error);
    } else {
      setReviews(prev =>
        prev.map(r =>
          r.id === reviewId ? { ...r, rating: newRating, comment: newComment } : r
        )
      );
    }
  };

  const handleLike = async (review) => {
    const newLikes = (review.likes || 0) + 1;
    const { data, error } = await supabase
      .from('reviews')
      .update({ likes: newLikes })
      .eq('id', review.id)
      .select();
    if (error) {
      console.error('Error liking review:', error);
    } else if (data && data.length > 0) {
      setReviews(prev =>
        prev.map(r => (r.id === review.id ? { ...r, likes: data[0].likes } : r))
      );
    }
  };

  const handleDislike = async (review) => {
    const newDislikes = (review.dislikes || 0) + 1;
    const { data, error } = await supabase
      .from('reviews')
      .update({ dislikes: newDislikes })
      .eq('id', review.id)
      .select();
    if (error) {
      console.error('Error disliking review:', error);
    } else if (data && data.length > 0) {
      setReviews(prev =>
        prev.map(r => (r.id === review.id ? { ...r, dislikes: data[0].dislikes } : r))
      );
    }
  };

  // Aquí tienes el componente interno que renderiza cada reseña (ReviewItem):
  const ReviewItem = ({ review }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editRating, setEditRating] = useState(review.rating);
    const [editComment, setEditComment] = useState(review.comment);
  
    return (
      <motion.li
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mb-4 bg-gray-800 p-4 rounded"
      >
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
            <Button
              onClick={() => {
                handleEdit(review.id, editRating, editComment);
                setIsEditing(false);
              }}
            >
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
            <div className="flex items-center mt-2 space-x-4">
              {/* Sección de Me Gusta */}
              <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleLike(review)}
                  className="p-1 text-xl text-gray-400 hover:text-yellow-300 transition-colors"
                  title="Me gusta"
                >
                  <FaThumbsUp />
                </motion.button>
                <span className="ml-1 text-xs text-gray-400">
                  ({review.likes || 0})
                </span>
              </div>
              {/* Sección de Dislike */}
              <div className="flex items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDislike(review)}
                  className="p-1 text-xl text-gray-400 hover:text-yellow-300 transition-colors"
                  title="No me gusta"
                >
                  <FaThumbsDown />
                </motion.button>
                <span className="ml-1 text-xs text-gray-400">
                  ({review.dislikes || 0})
                </span>
              </div>
              {user && user.id === review.user_id && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-xl text-gray-400 hover:text-yellow-300 transition-colors"
                    title="Editar reseña"
                  >
                    <FaPencilAlt />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(review.id)}
                    className="p-1 text-xl text-gray-400 hover:text-yellow-300 transition-colors"
                    title="Eliminar reseña"
                  >
                    <FaMinusCircle />
                  </motion.button>
                </>
              )}
            </div>
            <ReviewReplies reviewId={review.id} />
          </div>
        )}
      </motion.li>
    );
  };

  if (loading) return <Loader />;
  if (!reviews || reviews.length === 0)
    return <p className="text-gray-400">No hay comentarios para esta película.</p>;

  return (
    <div className="review-list mt-4">
      <h3 className="text-2xl font-bold mb-2">Comentarios</h3>
      <ul>
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ul>
    </div>
  );
};

export default ReviewList;