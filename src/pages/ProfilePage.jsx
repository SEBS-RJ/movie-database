// movie-database/src/pages/ProfilePage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
import Loader from '../components/UI/Loader';
import AuthContext from '../context/authContext';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para controlar el modo de edición y los valores editables
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error) {
          console.error('Error al obtener el perfil:', error);
        } else if (data) {
          setProfile(data);
          // Inicializamos los estados de edición con los valores actuales
          setUsername(data.username);
          setBio(data.bio);
          setAvatarUrl(data.avatar_url);
        }
        setLoading(false);
      };
      fetchProfile();
    }
  }, [user]);

  const updateProfile = async () => {
    setLoading(true);
    const updates = {
      username,
      bio,
      avatar_url: avatarUrl,
      updated_at: new Date()
    };

    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      console.error('Error al actualizar el perfil:', error);
      setMessage('Error al actualizar el perfil.');
    } else {
      setMessage('Perfil actualizado exitosamente.');
      // Actualizamos el estado del perfil
      setProfile({ ...profile, ...updates });
      setIsEditing(false);
    }
    setLoading(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="profile-page max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Perfil de Usuario</h2>
      {message && <p className="mb-2 text-green-400">{message}</p>}
      {profile ? (
        <>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Nombre de usuario:</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="p-2 bg-gray-900 text-yellow-300 rounded border border-gray-700 w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Biografía:</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="p-2 bg-gray-900 text-yellow-300 rounded border border-gray-700 w-full"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label className="block mb-1">URL del Avatar:</label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  className="p-2 bg-gray-900 text-yellow-300 rounded border border-gray-700 w-full"
                  placeholder="https://..."
                />
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={updateProfile}
                  className="bg-yellow-300 text-gray-900 px-4 py-2 rounded hover:bg-yellow-400 transition"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-2">
                <strong>Nombre de usuario:</strong> {profile.username}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="mb-2">
                <strong>Biografía:</strong> {profile.bio || 'No proporcionada'}
              </p>
              {profile.avatar_url && (
                <div className="mb-2">
                  <img
                    src={profile.avatar_url}
                    alt="Avatar del usuario"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="bg-yellow-300 text-gray-900 px-4 py-2 rounded hover:bg-yellow-400 transition"
              >
                Editar perfil
              </button>
            </>
          )}
        </>
      ) : (
        <p>No se encontró el perfil.</p>
      )}
    </div>
  );
};

export default ProfilePage;
