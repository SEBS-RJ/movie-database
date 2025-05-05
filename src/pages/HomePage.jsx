// movie-database/src/pages/HomePage.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
import MovieList from '../components/Movies/MovieList';
import Loader from '../components/UI/Loader';
import AuthContext from '../context/authContext';
import RecommendedMovies from '../components/Movies/RecommendedMovies';
/* eslint-disable-next-line no-unused-vars */
import { motion } from 'framer-motion';
import CategoryFilter from '../components/Movies/CategoryFilter';
import OrderFilter from '../components/Movies/OrderFilter';

const HomePage = () => {
  const { user } = useContext(AuthContext);

  // Estados para películas y paginación
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  const limit = 20; // Películas por página

  // Estados para filtros
  const [genreFilter, setGenreFilter] = useState('Todos');
  const [order, setOrder] = useState('title_asc');

  // Objeto de filtros debounced
  const [filterParams, setFilterParams] = useState({
    genre: 'Todos',
    order: 'title_asc'
  });

  const debounceTimeout = useRef();

  // Efecto debounce para actualizar filtros y reiniciar la paginación
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setFilterParams({
        genre: genreFilter,
        order: order
      });
      setPage(1);
    }, 300);
    return () => clearTimeout(debounceTimeout.current);
  }, [genreFilter, order]);

  // Efecto para obtener películas según los filtros
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);

      let query = supabase.from('movies').select('*', { count: 'exact' });
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
    <div className="home-page relative container mx-auto p-8 bg-gradient-to-b from-gray-900 to-gray-900 rounded-xl shadow-2xl">
      
      {/* Contenedor de filtros en la esquina superior derecha */}
      <div className="absolute top-4 right-4 z-50 flex flex-col sm:flex-row gap-2">
        <CategoryFilter 
          selectedCategory={genreFilter === 'Todos' ? '' : genreFilter}
          onCategorySelect={(value) => setGenreFilter(value ? value : 'Todos')}
        />
        <OrderFilter 
          selectedOrder={order}
          onOrderSelect={(value) => setOrder(value)}
        />
      </div>

      <h2 className="text-3xl font-bold mb-4">Películas</h2>
      
      {loading ? (
        <Loader />
      ) : (
        <MovieList movies={movies} user={user} />
      )}
      {!loading && movies.length === 0 && (
        <p className="text-gray-400">No se encontraron películas que cumplan con los filtros.</p>
      )}
      
      {totalPages > 1 && (
        <div className="pagination flex space-x-2 mt-4 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-3 py-1 border rounded-full transition-colors ${
                page === pageNum ? 'bg-yellow-300 text-gray-900' : 'bg-gray-800 text-yellow-300 hover:bg-gray-700'
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>
      )}

      <RecommendedMovies />
    </div>
  );
};

export default HomePage;
