// movie-database/src/components/UI/Loader.jsx
import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-300"></div>
    </div>
  );
};

export default Loader;
