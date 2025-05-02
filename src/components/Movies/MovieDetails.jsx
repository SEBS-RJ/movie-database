// movie-database/src/components/Movies/MovieDetails.jsx
import React from 'react';
import FavoriteButton from '../UI/FavoriteButton';
import ReviewsSection from '../Reviews/ReviewsSection';
import TrailerSection from './TrailerSection';
import SimilarMovies from './SimilarMovies';

const MovieDetails = ({ movie, user }) => {
  // Suponemos que 'genre' viene como arreglo (por ejemplo, ['Drama', 'Acción'])
  const currentGenres = movie.genre || [];

  return (
    <div className="movie-details container mx-auto p-4 bg-gray-800 rounded-lg shadow-lg">
      
      {/* Título de la película en la parte superior (centrado) */}
      <h1 className="text-4xl text-yellow-300 font-bold text-center mb-6">
        {movie.title}
      </h1>

      {/* Bloque superior: dos columnas */}
      <div className="flex flex-col md:flex-row gap-5">
        {/* Columna izquierda: Portada y Datos adicionales */}
        <div className="md:w-1/2 flex flex-col items-center">
          {/* Portada reducida */}
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-auto object-cover rounded-md mb-4 max-w-sm"
          />
          {/* Datos adicionales */}
          <div className="bg-gray-900 p-2 rounded">
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Año de estreno:</span> {movie.release_year}
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Género:</span>{" "}
              {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Duración:</span> {movie.duration} minutos
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Directores:</span>{" "}
              {Array.isArray(movie.directors) ? movie.directors.join(", ") : movie.directors}
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Actores:</span>{" "}
              {Array.isArray(movie.actors) ? movie.actors.join(", ") : movie.actors}
            </p>
            <p className="text-gray-300 mb-2">
              <span className="font-semibold">Rating:</span> {movie.rating}/10
            </p>
          </div>
        </div>
        
        {/* Columna derecha: Bloque de Sinopsis y Favorito, y luego Tráiler */}
        <div className="md:w-1/2 flex flex-col gap-5 md:-ml-20">
          {/* Bloque de Sinopsis y botón de Favorito */}
          <div className="bg-gray-900 p-4 rounded">
            <h2 className="text-2xl text-yellow-300 font-bold mb-2">Sinopsis</h2>
            <p className="text-gray-300 mb-4">{movie.description}</p>
            {user && (
              <FavoriteButton
                movieId={movie.id}
                userId={user.id}
                isFavoriteInitial={false}
              />
            )}
          </div>
          {/* Bloque del tráiler responsivo */}
          {movie.trailer_url && (
            <div className="bg-gray-900 p-4 rounded">
              <h2 className="text-2xl text-yellow-300 font-bold mb-2">Tráiler</h2>
              <div className="relative pb-[0%] overflow-hidden rounded shadow-lg">
                <TrailerSection trailerUrl={movie.trailer_url} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bloque completo para Comentarios */}
      <div className="mt-12">
        <ReviewsSection movieId={movie.id} />
      </div>

      {/* Bloque de Películas Similares (opcional) */}
      <div className="mt-12">
        <SimilarMovies currentMovieId={movie.id} currentGenres={currentGenres} />
      </div>
    </div>
  );
};

export default MovieDetails;
