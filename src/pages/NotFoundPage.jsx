// movie-database/src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-page text-center py-20">
      <h2 className="text-4xl font-bold mb-4">404 - Página no encontrada</h2>
      <Link className="text-yellow-300 underline" to="/">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFoundPage;

