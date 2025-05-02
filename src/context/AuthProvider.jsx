// movie-database/src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import AuthContext from './authContext';
import { supabase } from '../lib/supabaseClient';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null); // nuevo estado para perfil extendido
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setError(error);
        } else {
          const currentUser = data?.session?.user || null;
          setUser(currentUser);
          if (currentUser) {
            // Consulta del perfil extendido, incluyendo el campo admin
            const { data: profileData, error: profileError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', currentUser.id)
              .single();
            if (profileError) {
              console.error('Error cargando el perfil:', profileError);
            } else {
              setUserProfile(profileData);
            }
          }
        }
      } catch (err) {
        console.error("Error en getSession:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        // Vuelve a cargar el perfil al producirse un cambio
        supabase
          .from('user_profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error al cargar perfil en estado change:', error);
            } else {
              setUserProfile(data);
            }
          });
      } else {
        setUserProfile(null);
      }
    });
    
    return () => {
      if (authListener && typeof authListener.unsubscribe === "function") {
        authListener.unsubscribe();
      }
    };
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-yellow-300">
        <p>Cargando autenticación...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-600 text-white">
        <p>Error en la autenticación: {error.message || "Error desconocido"}</p>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={{ user, userProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
