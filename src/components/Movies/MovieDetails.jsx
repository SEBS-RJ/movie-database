// movie-database/src/components/Movies/MovieDetails.jsx
import React from 'react';
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import FavoriteButton from '../UI/FavoriteButton';
import ReviewsSection from '../Reviews/ReviewsSection';
import TrailerSection from './TrailerSection';
import RecommendedMovies from './RecommendedMovies';

const MovieDetails = ({ movie, user }) => {
  // Normalización de campos (en este ejemplo, solo se usa para mostrar datos)
  const genres = Array.isArray(movie.genre) ? movie.genre : [movie.genre];
  const directors = Array.isArray(movie.directors) ? movie.directors : [movie.directors];
  const actors = Array.isArray(movie.actors) ? movie.actors : [movie.actors];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="movie-details container mx-auto p-8 bg-gradient-to-b from-gray-900 to-gray-900 rounded-xl shadow-2xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-5xl text-yellow-300 font-extrabold text-center mb-8">
        {movie.title}
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Columna izquierda: Póster y detalles básicos */}
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="relative w-full max-w-sm">
            <motion.img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full h-auto object-cover rounded-md"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            {user && (
              <FavoriteButton movieId={movie.id} userId={user.id} />
            )}
          </div>
          <div className="p-5 rounded shadow-md w-90 bg-gray-950 mt-4">
            <p className="text-gray-300">
              <strong>Año:</strong> {movie.release_year}
            </p>
            <p className="text-gray-300">
              <strong>Género:</strong> {genres.join(", ")}
            </p>
            <p className="text-gray-300">
              <strong>Duración:</strong> {movie.duration} min
            </p>
            <p className="text-gray-300">
              <strong>Director:</strong> {directors.join(", ")}
            </p>
            <p className="text-gray-300">
              <strong>Actores:</strong> {actors.join(", ")}
            </p>
            <p className="text-gray-300">
              <strong>Rating:</strong> {movie.rating}/10
            </p>
          </div>
        </div>
        {/* Columna derecha: Sinopsis y Tmporal de Trailer */}
        <div className="md:w-1/2">
          <div className="bg-gray-950 p-6 rounded shadow-md space-y-6">
            <div>
              <h2 className="text-3xl text-yellow-300 font-bold mb-2">Sinopsis</h2>
              <p className="text-gray-300">{movie.description}</p>
            </div>
            {movie.trailer_url && (
              <div>
                <hr className="border-gray-950 mb-4" />
                <TrailerSection trailerUrl={movie.trailer_url} />
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Sección de Reviews */}
      <div className="mt-12">
        <ReviewsSection movieId={movie.id} />
      </div>
      {/* Carrusel de Recomendados (excluye la película actual) */}
      <div className="mt-12">
        <RecommendedMovies excludeMovieId={movie.id} />
      </div>
    </motion.div>
  );
};

export default MovieDetails;
