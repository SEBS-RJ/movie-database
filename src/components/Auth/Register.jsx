// movie-database/src/components/Auth/Register.jsx
import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="register max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-yellow-300">Registro</h2>
      {errorMsg && <p className="mb-4 text-red-500">{errorMsg}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-yellow-300">Nombre de Usuario</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-900 text-yellow-300 border border-gray-700"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tu nombre de usuario"
            required
          />
        </div>
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
        <Button type="submit">Registrar</Button>
      </form>
    </div>
  );
};

export default Register;

