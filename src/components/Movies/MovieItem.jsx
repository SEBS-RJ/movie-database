// movie-database/src/components/Movies/MovieItem.jsx
import React, { useState, useRef } from 'react';
/* eslint-disable-next-line no-unused-vars */
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MovieItem = ({ movie }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    // Activa el overlay después de 0.5 segundos de hover
    timeoutRef.current = setTimeout(() => {
      setShowOverlay(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    // Cancela el timer y oculta el overlay
    clearTimeout(timeoutRef.current);
    setShowOverlay(false);
  };

  return (
    <Link to={`/movies/${movie.id}`} className="inline-block mr-4 relative">
      <motion.div
        className="w-48 h-72 overflow-hidden rounded relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ scrollSnapAlign: 'start' }}
      >
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showOverlay ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-2 text-white"
        >
          <h4 className="text-sm font-bold">{movie.title}</h4>
          {movie.release_year && (
            <p className="text-xs">Año: {movie.release_year}</p>
          )}
          {movie.rating && (
            <p className="text-xs">Rating: {movie.rating}</p>
          )}
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default MovieItem;
