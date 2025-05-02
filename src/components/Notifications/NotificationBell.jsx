// movie-database/src/components/Notifications/NotificationBell.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel('public:movies')
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="relative p-2">
        <svg
          className="w-6 h-6 text-yellow-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 
            2 0 10-4 0v1.341C8.67 7.163 8 8.388 8 9.75v4.408c0 .41-.168.805-.465 1.095L6 17h5m4 
            0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-md shadow-lg z-50">
          <div className="p-2">
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
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
