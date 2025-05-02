// movie-database/src/components/Layout/Header.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContext';
import { supabase } from '../../lib/supabaseClient';
import NotificationBell from '../Notifications/NotificationBell';

const Header = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error al cerrar sesión:', error);
    } else {
      navigate('/login');
      window.location.reload();
    }
  };

  return (
    <header className="bg-gray-800 p-4 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-yellow-300">
        <Link to="/">Mi PelisApp</Link>
      </h1>
      <nav className="flex items-center space-x-4">
        <ul className="flex space-x-4">
          <li>
            <Link className="text-yellow-300 hover:underline" to="/">Inicio</Link>
          </li>
          {user ? (
            <>
              <li>
                <Link className="text-yellow-300 hover:underline" to="/profile">Perfil</Link>
              </li>
              <li>
                <Link className="text-yellow-300 hover:underline" to="/favorites">Favoritos</Link>
              </li>
              <li>
                <button className="text-yellow-300 hover:underline" onClick={handleSignOut}>
                  Salir
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link className="text-yellow-300 hover:underline" to="/login">Ingresar</Link>
              </li>
              <li>
                <Link className="text-yellow-300 hover:underline" to="/register">Registro</Link>
              </li>
            </>
          )}
        </ul>
        {/* Solo aquí se muestra el NotificationBell */}
        <NotificationBell />
      </nav>
    </header>
  );
};

export default Header;
