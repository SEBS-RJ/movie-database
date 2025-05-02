// movie-database/src/components/Reviews/ReviewsSection.jsx
import React, { useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import ReviewStats from './ReviewStats';

const ReviewsSection = ({ movieId }) => {
  // Usamos refresh para forzar recargar la lista tras agregar una reseña
  const [refresh, setRefresh] = useState(false);

  const handleReviewAdded = () => {
    setRefresh(prev => !prev);
  };

  return (
    <div className="reviews-section mt-8">
      <ReviewStats movieId={movieId} />
      <ReviewForm movieId={movieId} onReviewAdded={handleReviewAdded} />
      {/* Cambiamos la key para refrescar ReviewList */}
      <ReviewList key={refresh} movieId={movieId} />
    </div>
  );
};

export default ReviewsSection;
