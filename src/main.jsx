// movie-database/src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import AuthProvider from './context/AuthProvider';  // Importamos nuestro AuthProvider unificado
import { SearchProvider } from './context/SearchContext'; // Si usas búsqueda global
import ErrorBoundary from './ErrorBoundary';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <AuthProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
} else {
  console.error("No se encontró el elemento 'root' en index.html");
}
