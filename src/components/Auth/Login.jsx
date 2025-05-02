// movie-database/src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="login max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-yellow-300">Iniciar Sesión</h2>
      {errorMsg && <p className="mb-4 text-red-500">{errorMsg}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-yellow-300">Email</label>
          <input
            type="email"
            className="w-full p-2 rounded bg-gray-900 text-yellow-300 border border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            required
          />
        </div>
        <div>
          <label className="block text-yellow-300">Contraseña</label>
          <input
            type="password"
            className="w-full p-2 rounded bg-gray-900 text-yellow-300 border border-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
          />
        </div>
        <Button type="submit">Ingresar</Button>
      </form>
    </div>
  );
};

export default Login;

