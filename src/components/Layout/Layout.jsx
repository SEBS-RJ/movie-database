// movie-database/src/components/Layout/Layout.jsx
import React from 'react';
import { motion as Motion } from 'framer-motion'; // renombramos motion a Motion
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="layout bg-gradient from-black to-gray-700 text-yellow-300 min-h-screen flex flex-col">
      <Header />
      <Motion.main
        className="flex-grow container mx-auto p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </Motion.main>
      <Footer />
    </div>
  );
};

export default Layout;
