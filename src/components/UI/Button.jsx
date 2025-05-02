// movie-database/src/components/UI/Button.jsx
import React from 'react';

const Button = ({ children, onClick, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-yellow-300 text-gray-900 px-4 py-2 rounded hover:bg-yellow-400 transition"
    >
      {children}
    </button>
  );
};

export default Button;


