// movie-database/src/components/Movies/MovieCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
/* eslint-disable-next-line no-unused-vars */
import { motion } from 'framer-motion';
import FavoriteButton from '../UI/FavoriteButton';

const MovieCard = ({ movie, user, onFavoriteToggle }) => {
  return (
    <div className="relative group border border-gray-700 rounded overflow-hidden shadow-lg">
      {/* El Link incluye solo la imagen y la info que dirige a los detalles */}
      <Link to={`/movies/${movie.id}`}>
        <motion.img
          src={movie.poster_url}
          alt={movie.title}
          loading="lazy"
          className="w-full h-64 object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <div className="p-4">
          <h3 className="text-2xl font-bold text-yellow-300 mb-2">{movie.title}</h3>
          <p className="text-sm text-gray-300">
            {movie.release_year} &bull; {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
          </p>
          <p className="text-sm text-gray-300">Duración: {movie.duration} min</p>
        </div>
      </Link>
      {/* El FavoriteButton se ubica dentro del contenedor, fuera del Link.
          Se pasa el callback onFavoriteToggle para que, al cambiar el estado de favorito,
          se notifique al componente padre */}
      {user && (
        <FavoriteButton 
          movieId={movie.id} 
          userId={user.id} 
          onToggleFavorite={onFavoriteToggle} 
        />
      )}
    </div>
  );
};

export default MovieCard;

