// movie-database/src/components/Movies/MovieList.jsx
import React from 'react';
import MovieCard from './MovieCard';

const MovieList = ({ movies, user }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-6 gap-4 p-4">
      {movies.length === 0 && (
        <p className="text-gray-400 col-span-10 text-center">No se encontraron películas que cumplan con los filtros.</p>
      )}
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} user={user} />
      ))}
    </div>
  );
};

export default MovieList;
