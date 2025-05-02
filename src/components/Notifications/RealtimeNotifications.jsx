// movie-database/src/components/Notifications/RealtimeNotifications.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const RealtimeNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Se crea un canal para escuchar cambios en la tabla "movies"
    const channel = supabase.channel('public:movies')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'movies'
        },
        (payload) => {
          console.log('Nueva película agregada:', payload);
          setNotifications((prev) => [
            ...prev,
            { type: 'new_movie', data: payload.new }
          ]);
        }
      )
      .subscribe();

    // Cleanup: remover el canal cuando se desmonte el componente
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-white text-black p-4 rounded shadow-md z-50">
      <h4 className="font-bold mb-2">Notificaciones</h4>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div key={index} className="mb-1">
            {notification.type === 'new_movie' && (
              <span>
                Nueva película: <strong>{notification.data.title}</strong>
              </span>
            )}
          </div>
        ))
      ) : (
        <div>No hay notificaciones.</div>
      )}
    </div>
  );
};

export default RealtimeNotifications;
