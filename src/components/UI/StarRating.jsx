// movie-database/src/components/UI/StarRating.jsx
import React from 'react';

const FullStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81H6.81a1 1 0 00.95-.69l1.286-3.97z" />
  </svg>
);

const EmptyStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 20 20">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.97 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.97c.3.92-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.783.57-1.838-.197-1.539-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81H6.81a1 1 0 00.95-.69l1.286-3.97z" />
  </svg>
);

const HalfStar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20">
    <defs>
      <linearGradient id="halfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="50%" stopColor="#FBBF24" />
        <stop offset="50%" stopColor="transparent" />
      </linearGradient>
    </defs>
    <path
      fill="url(#halfGrad)"
      stroke="currentColor"
      strokeWidth="1"
      className="text-yellow-500"
      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81H6.81a1 1 0 00.95-.69l1.286-3.97z"
    />
  </svg>
);

/**
 * Componente interactivo para la valoración en estrellas.
 * Se espera que el valor ('rating') esté en la escala de 0 a 5.
 * Al hacer clic en una estrella, se llama a 'onChange' con el nuevo valor.
 */
const StarRating = ({ rating = 0, onChange, max = 5 }) => {
  // Aseguramos que rating sea un número seguro.
  const safeRating = Number(rating) || 0;
  const fullStars = Math.floor(safeRating);
  const halfStar = safeRating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = max - fullStars - halfStar;

  const handleClick = (newRating) => {
    if (onChange) {
      onChange(newRating);
    }
  };

  return (
    <div className="flex">
      {Array.from({ length: fullStars }).map((_, i) => (
        <span
          key={`full-${i}`}
          onClick={() => handleClick(i + 1)}
          style={{ cursor: 'pointer' }}
        >
          <FullStar />
        </span>
      ))}
      {halfStar === 1 && (
        <span
          onClick={() => handleClick(fullStars + 0.5)}
          style={{ cursor: 'pointer' }}
        >
          <HalfStar />
        </span>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <span
          key={`empty-${i}`}
          onClick={() => handleClick(fullStars + halfStar + i + 1)}
          style={{ cursor: 'pointer' }}
        >
          <EmptyStar />
        </span>
      ))}
    </div>
  );
};

export default StarRating;
