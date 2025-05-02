// movie-database/src/components/Layout/Layout.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="layout bg-gray-900 text-yellow-300 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <Footer />
      {/* Componente de notificaciones en tiempo real */}
    </div>
  );
};

export default Layout;
