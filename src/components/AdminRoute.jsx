// movie-database/src/components/AdminRoute.jsx
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authcontext';

const AdminRoute = ({ children }) => {
  const { userProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Si no existe el perfil o el usuario no es admin, redirige a la Home
    if (!userProfile || !userProfile.is_admin) {
      navigate('/');
    }
  }, [userProfile, navigate]);

  return userProfile && userProfile.is_admin ? children : null;
};

export default AdminRoute;
