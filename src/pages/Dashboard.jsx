// movie-database/src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Loader from '../components/UI/Loader';

const Dashboard = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('id', { ascending: true });
      if (error) {
        console.error('Error al cargar las películas:', error);
        setErrorMsg('Error al cargar las películas.');
      } else {
        setMovies(data);
      }
      setLoading(false);
    };

    fetchMovies();
  }, []);

  const handleDelete = async (movieId) => {
    // Acción de eliminación para el administrador
    try {
      const { error } = await supabase
        .from('movies')
        .delete()
        .eq('id', movieId);
      if (error) throw error;
      setMovies((prev) => prev.filter(movie => movie.id !== movieId));
    } catch (error) {
      console.error('Error al eliminar la película:', error);
      setErrorMsg('No se pudo eliminar la película.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dashboard Administrativo</h1>
      {loading && <Loader />}
      {errorMsg && <div className="mb-4 text-red-500">{errorMsg}</div>}
      {!loading && movies.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Películas</h2>
          <table className="min-w-full bg-gray-800 text-yellow-300">
            <thead>
              <tr>
                <th className="py-2 border-b border-gray-700 text-left">ID</th>
                <th className="py-2 border-b border-gray-700 text-left">Título</th>
                <th className="py-2 border-b border-gray-700 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(movie => (
                <tr key={movie.id}>
                  <td className="py-2 border-b border-gray-700">{movie.id}</td>
                  <td className="py-2 border-b border-gray-700">{movie.title}</td>
                  <td className="py-2 border-b border-gray-700">
                    {/* Aquí podrías incorporar un botón para editar en el futuro */}
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && movies.length === 0 && (
        <p className="text-gray-400">No hay películas registradas.</p>
      )}
    </div>
  );
};

export default Dashboard;
