// movie-database/src/components/Layout/Header.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../../context/authContext';
import { supabase } from '../../lib/supabaseClient';
import NotificationBell from '../Notifications/NotificationBell';
import { SearchContext } from '../../context/SearchContext';
/* eslint-disable-next-line no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user } = useContext(AuthContext);
  const { setSearchTerm } = useContext(SearchContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Estados para el input de búsqueda y sugerencias
  const [localSearch, setLocalSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Handler para cerrar sesión
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
    } else {
      navigate('/login');
      window.location.reload();
    }
  };

  // Función para determinar si la ruta se corresponde con el enlace
  const isActive = (path) => location.pathname === path;

  // Al presionar Enter en la búsqueda se navega a la ruta de resultados
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(localSearch);
      navigate(`/search?q=${encodeURIComponent(localSearch)}`);
      setShowSuggestions(false);
    }
  };

  // Efecto con debounce para obtener sugerencias de búsqueda
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (localSearch.trim().length > 1) {
        const { data, error } = await supabase
          .from('movies')
          .select('id, title')
          .ilike('title', `%${localSearch}%`)
          .limit(5);
        if (!error) {
          setSuggestions(data);
        } else {
          console.error(error);
          setSuggestions([]);
        }
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch]);

  return (
    <header className="bg-gradient-to-tr from-black to-gray-900 py-4 shadow-lg">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Bloque izquierdo: Logo y barra de búsqueda */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <img
              src="./../assets/logo.png"  
              alt="Logo"
              className="w-[100px] h-auto object-contain mr-3 transition-transform hover:scale-125"
              />
            <h1 className="text-4xl font-extrabold text-yellow-300 drop-shadow-lg transition-transform hover:scale-110">
              Mi PelisApp
            </h1>
          </Link>
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Buscar..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setSearchTerm(e.target.value);
              }}
              onKeyDown={handleSearchKeyDown}
              className="w-full box-border py-2 pl-2 pr-80 bg-gray-700 text-yellow-300 border border-gray-600 rounded focus:outline-none hover:ring-2 hover:ring-imdb-yellow"
            />
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-full left-0 w-full mt-1 z-50 bg-gray-700 border border-gray-600 rounded"
                >
                  {suggestions.map((sugg) => (
                    <motion.li
                      key={sugg.id}
                      className="px-3 py-2 hover:bg-gray-600 cursor-pointer"
                      onClick={() => {
                        setLocalSearch('');
                        setSearchTerm(sugg.title);
                        setShowSuggestions(false);
                        navigate(`/movies/${sugg.id}`);
                      }}
                    >
                      {sugg.title}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Menú de navegación */}
        <nav className="flex items-center space-x-4">
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/"
                className={`transition-colors text-lg ${
                  isActive('/') ? 'text-imdb-yellow font-bold underline' : 'text-yellow-300 hover:underline'
                }`}
              >
                Inicio
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link
                    to="/profile"
                    className={`transition-colors text-lg ${
                      isActive('/profile') ? 'text-imdb-yellow font-bold underline' : 'text-yellow-300 hover:underline'
                    }`}
                  >
                    Perfil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/favorites"
                    className={`transition-colors text-lg ${
                      isActive('/favorites') ? 'text-imdb-yellow font-bold underline' : 'text-yellow-300 hover:underline'
                    }`}
                  >
                    Favoritos
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="transition-colors text-lg text-yellow-300 hover:underline"
                  >
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className={`transition-colors text-lg ${
                      isActive('/login') ? 'text-imdb-yellow font-bold underline' : 'text-yellow-300 hover:underline'
                    }`}
                  >
                    Ingresar
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className={`transition-colors text-lg ${
                      isActive('/register') ? 'text-imdb-yellow font-bold underline' : 'text-yellow-300 hover:underline'
                    }`}
                  >
                    Registro
                  </Link>
                </li>
              </>
            )}
            {/* Se elimina el <Link> para notificaciones, se inserta directamente el componente */}
            <li>
              <NotificationBell />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

