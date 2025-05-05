// movie-database/src/components/Movies/CategoryFilter.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { label: "Todas", value: "" },
  { label: "Acción", value: "Acción" },
  { label: "Aventura", value: "Aventura" },
  { label: "Animación", value: "Animación" },
  { label: "Artes Marciales", value: "Artes Marciales" },
  { label: "Biografía", value: "Biografía" },
  { label: "Ciencia Ficción", value: "Ciencia Ficción" },
  { label: "Comedia", value: "Comedia" },
  { label: "Crimen", value: "Crimen" },
  { label: "Documental", value: "Documental" },
  { label: "Drama", value: "Drama" },
  { label: "Fantasía", value: "Fantasía" },
  { label: "Guerra", value: "Guerra" },
  { label: "Misterio", value: "Misterio" },
  { label: "Música", value: "Música" },
  { label: "Musical", value: "Musical" },
  { label: "Romance", value: "Romance" },
  { label: "Suspenso", value: "Suspenso" },
  { label: "Terror", value: "Terror" },
  { label: "Thriller", value: "Thriller" },
  { label: "Western", value: "Western" }
];

const CategoryFilter = ({ selectedCategory, onCategorySelect }) => {
  // Usamos onMouseEnter / onMouseLeave para desplegar el menú
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (value) => {
    onCategorySelect(value);
    setIsOpen(false); // cerrar inmediatamente al seleccionar
    if (value) {
      navigate(`/?genre=${encodeURIComponent(value)}`);
    } else {
      navigate(`/`);
    }
  };

  // Determinamos el texto a mostrar en el botón
  const currentSelection = categories.find(cat => cat.value === selectedCategory);
  const buttonText = currentSelection ? currentSelection.label : "Categorías";

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}  // Se cierra al retirar el cursor
    >
      <button
        className="inline-flex justify-center w-full rounded-md border border-gray-600 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-yellow-300 hover:bg-gray-700 focus:outline-none"
      >
        {buttonText}
        <svg
          className="ml-2 -mr-1 h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 01.894.553l5 10A1 1 0 0115 15H5a1 1 0 01-.894-1.447l5-10A1 1 0 0110 3zm0 2.618L6.618 13h6.764L10 5.618z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-1 w-56 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleSelect(cat.value)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-600 transition-colors ${
                  selectedCategory === cat.value
                    ? "bg-yellow-300 text-gray-900"
                    : "text-yellow-300"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
