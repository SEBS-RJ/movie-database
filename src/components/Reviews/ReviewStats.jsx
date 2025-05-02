// movie-database/src/components/Reviews/ReviewStats.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const ReviewStats = ({ movieId }) => {
  const [avgRating, setAvgRating] = useState(null);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating', { count: 'exact' })
        .eq('movie_id', movieId);
      if (error) {
        console.error('Error fetching review stats:', error);
      } else if (data && data.length > 0) {
        const total = data.reduce((acc, curr) => acc + parseFloat(curr.rating), 0);
        setAvgRating((total / data.length).toFixed(1));
        setTotalReviews(data.length);
      } else {
        setAvgRating(null);
        setTotalReviews(0);
      }
    };
    fetchStats();
  }, [movieId]);

  return (
    <div className="review-stats mb-4">
      {totalReviews > 0 ? (
        <p className="text-lg">
          Promedio de rating: <strong>{avgRating}</strong> ({totalReviews} comentarios)
        </p>
      ) : (
        <p className="text-lg">Sin comentarios aún.</p>
      )}
    </div>
  );
};

export default ReviewStats;
