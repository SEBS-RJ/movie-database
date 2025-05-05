// movie-database/src/components/Movies/RecommendedMovies.jsx
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Loader from '../UI/Loader';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MovieItem from './MovieItem';

const RecommendedMovies = ({ excludeMovieId }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  // Estados para flechas de navegación y scroll
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const carouselRef = useRef(null);

  const threshold = 20;
  const epsilon = 20;

  // Función de shuffle usando el algoritmo de Fisher–Yates
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const fetchRecommendedMovies = async () => {
    setLoading(true);
    try {
      // Consulta: obtiene películas ordenadas por rating descendente
      let query = supabase
        .from('movies')
        .select('*')
        .order('rating', { ascending: false });
      if (excludeMovieId) {
        query = query.neq('id', excludeMovieId);
      }
      query = query.limit(21);
      const { data, error } = await query;
      if (error) {
        console.error("Error fetching recommended movies:", error);
        setMovies([]);
      } else if (data) {
        // Mezcla el listado para obtener un orden aleatorio
        const shuffled = shuffleArray(data);
        setMovies(shuffled);
      }
    } catch (err) {
      console.error("Error in fetchRecommendedMovies:", err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedMovies();
  }, [excludeMovieId]);

  // Función que actualiza la visibilidad de las flechas del carrusel
  const updateArrowVisibility = () => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > threshold);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - threshold);
    }
  };

  useEffect(() => {
    updateArrowVisibility();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', updateArrowVisibility);
      return () => carousel.removeEventListener('scroll', updateArrowVisibility);
    }
  }, [movies]);

  const scrollLeftFunc = () => {
    if (carouselRef.current && !isScrolling) {
      setIsScrolling(true);
      const { scrollLeft, clientWidth } = carouselRef.current;
      let target = scrollLeft - clientWidth;
      if (target < 0) target = 0;
      carouselRef.current.scrollTo({ left: target, behavior: 'smooth' });
      setTimeout(() => setIsScrolling(false), 600);
    }
  };

  const scrollRightFunc = () => {
    if (carouselRef.current && !isScrolling) {
      setIsScrolling(true);
      const { scrollLeft, clientWidth, scrollWidth } = carouselRef.current;
      const remaining = scrollWidth - (scrollLeft + clientWidth);
      let target = scrollLeft + clientWidth;
      if (remaining <= epsilon) {
        target = scrollWidth - clientWidth;
      }
      if (target > scrollWidth - clientWidth) target = scrollWidth - clientWidth;
      carouselRef.current.scrollTo({ left: target, behavior: 'smooth' });
      setTimeout(() => setIsScrolling(false), 600);
    }
  };

  if (loading) return <Loader />;
  if (!movies || movies.length === 0)
    return <p className="text-gray-400 mt-4">No se encontraron películas recomendadas.</p>;

  return (
    <div className="recommended-movies mt-8 relative">
      <h3 className="text-2xl font-bold mb-4">Películas Recomendadas</h3>

      {/* Flecha izquierda */}
      {showLeftArrow && (
        <button
          onClick={scrollLeftFunc}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-yellow-300 p-2 rounded-full hover:bg-gray-700"
        >
          <FaChevronLeft size={20} />
        </button>
      )}

      {/* Carrusel */}
      <div
        ref={carouselRef}
        className="overflow-x-auto whitespace-nowrap scroll-smooth px-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollSnapType: 'x mandatory'
        }}
      >
        <style>{`
          .recommended-movies::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {movies.map((movie) => (
          <MovieItem key={movie.id} movie={movie} className = "inline-block w-64 md:w-72 lg:w-80"/>
        ))}
      </div>

      {/* Flecha derecha */}
      {showRightArrow && (
        <button
          onClick={scrollRightFunc}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-yellow-300 p-2 rounded-full hover:bg-gray-700"
        >
          <FaChevronRight size={20} />
        </button>
      )}
    </div>
  );
};

export default RecommendedMovies;
