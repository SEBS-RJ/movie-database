// movie-database/src/components/Movies/MovieCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movies/${movie.id}`}>
      <div className="movie-card group border border-gray-700 rounded overflow-hidden shadow-lg hover:shadow-x1 transition-shadow duration-300">
        <img
          src={movie.poster_url}
          alt={movie.title}
          loading="lazy"  // Carga diferida para optimizar performance
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="p-4">
          {/* Título */}
          <h3 className="text-xl font-bold text-yellow-300">{movie.title}</h3>
          {/* Año y Géneros */}
          <p className="text-sm text-gray-300">
            {movie.release_year} &bull;{" "}
            {Array.isArray(movie.genre)
              ? movie.genre.join(', ')
              : movie.genre}
          </p>
          {/* Duración */}
          <p className="text-sm text-gray-300">Duración: {movie.duration} min</p>
          {/* Director o Directores */}
          <p className="text-sm text-gray-300">
            Director
            {Array.isArray(movie.directors) && movie.directors.length > 1 ? 'es' : ''}:
            {" "}
            {Array.isArray(movie.directors)
              ? movie.directors.join(', ')
              : movie.directors}
          </p>
          {/* Actores */}
          <p className="text-sm text-gray-300">
            Actores:{" "}
            {Array.isArray(movie.actors)
              ? movie.actors.join(', ')
              : movie.actors}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
