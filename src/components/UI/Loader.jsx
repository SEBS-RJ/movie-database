// movie-database/src/components/UI/Loader.jsx
import React from 'react';

const Loader = () => {
  return (
    <div className="loader flex justify-center items-center">
      <div className="w-16 h-16 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;

