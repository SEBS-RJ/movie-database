// movie-database/src/pages/HomePage.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
import MovieList from '../components/Movies/MovieList';
import Loader from '../components/UI/Loader';
import { AuthContext } from '../context/authContext';
import RecommendedMovies from '../components/Movies/RecommendedMovies';

const genres = [
  'Todos',
  'Acción',
  'Aventura',
  'Animación',
  'Artes Marciales',
  'Biografía',
  'Ciencia Ficción',
  'Comedia',
  'Crimen',
  'Documental',
  'Drama',
  'Fantasía',
  'Guerra',
  'Misterio',
  'Música',
  'Musical',
  'Romance',
  'Suspenso',
  'Terror',
  'Thriller',
  'Western',
];

const HomePage = () => {
  const { user } = useContext(AuthContext);

  // Estados para la lista de películas, paginación y carga
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);

  // Estados inmediatos de filtros (controlados por el usuario)
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('Todos');
  const [order, setOrder] = useState('title_asc');

  // Objeto de filtros debounced
  const [filterParams, setFilterParams] = useState({
    search: '',
    genre: 'Todos',
    order: 'title_asc'
  });

  const debounceTimeout = useRef();
  const limit = 24; // Películas por página

  // Efecto para actualizar (debounced) los filtros y reiniciar la paginación
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setFilterParams({
        search: searchTerm,
        genre: genreFilter,
        order: order
      });
      setPage(1);
    }, 300);
    return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm, genreFilter, order]);

  // Efecto para obtener las películas
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);

      let query = supabase.from('movies').select('*', { count: 'exact' });
      if (filterParams.search) {
        query = query.ilike('title', `%${filterParams.search}%`);
      }
      if (filterParams.genre !== 'Todos') {
        query = query.contains('genre', [filterParams.genre]);
      }
      if (filterParams.order.startsWith('title')) {
        query = query.order('title', { ascending: filterParams.order === 'title_asc' })
                     .order('id', { ascending: true });
      } else if (filterParams.order.startsWith('year')) {
        query = query.order('release_year', { ascending: filterParams.order === 'year_asc' })
                     .order('id', { ascending: true });
      } else if (filterParams.order.startsWith('rating')) {
        query = query.order('rating', { ascending: filterParams.order === 'rating_asc' })
                     .order('id', { ascending: true });
      }

      query = query.range((page - 1) * limit, page * limit - 1);
      const { data, error, count } = await query;
      if (error) {
        console.error("Error al obtener películas:", error);
      } else {
        setMovies(data);
        if (count !== null) setTotalMovies(count);
      }
      setLoading(false);
    };

    fetchMovies();
  }, [page, filterParams]);

  const totalPages = Math.ceil(totalMovies / limit);

  return (
    <div className="home-page">
      <h2 className="text-3xl font-bold mb-4">Películas</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por título"
          className="p-2 rounded bg-gray-900 text-yellow-300 border border-gray-700 flex-grow"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select
          value={genreFilter}
          onChange={e => setGenreFilter(e.target.value)}
          className="p-1 rounded bg-gray-900 text-yellow-300 border border-gray-700"
        >
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select
          value={order}
          onChange={e => setOrder(e.target.value)}
          className="p-1 rounded bg-gray-900 text-yellow-300 border border-gray-700"
        >
          <option value="title_asc">Título ↑</option>
          <option value="title_desc">Título ↓</option>
          <option value="year_asc">Año ↑</option>
          <option value="year_desc">Año ↓</option>
          <option value="rating_asc">Rating ↑</option>
          <option value="rating_desc">Rating ↓</option>
        </select>
      </div>
      {loading ? <Loader /> : <MovieList movies={movies} user={user} />}
      {!loading && movies.length === 0 && (
        <p className="text-gray-400">No se encontraron películas que cumplan con los filtros.</p>
      )}
      {totalPages > 1 && (
        <div className="pagination flex space-x-2 mt-4 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-3 py-1 border rounded transition-colors ${
                page === pageNum ? 'bg-yellow-300 text-gray-900' : 'bg-gray-800 text-yellow-300 hover:bg-gray-700'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}

      {/* Aquí se integra la sección de recomendaciones */}
      <RecommendedMovies />
    </div>
  );
};

export default HomePage;
