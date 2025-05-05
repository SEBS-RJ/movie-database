// movie-database/src/components/Movies/OrderFilter.jsx
import React, { useState } from 'react';

const orderOptions = [
  { label: "Título ↑", value: "title_asc" },
  { label: "Título ↓", value: "title_desc" },
  { label: "Año ↑", value: "year_asc" },
  { label: "Año ↓", value: "year_desc" },
  { label: "Rating ↑", value: "rating_asc" },
  { label: "Rating ↓", value: "rating_desc" },
];

const OrderFilter = ({ selectedOrder, onOrderSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    onOrderSelect(value);
    setIsOpen(false);
  };

  const currentSelection = orderOptions.find(opt => opt.value === selectedOrder);
  const buttonText = currentSelection ? currentSelection.label : "Ordenar";

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
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
            {orderOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-600 transition-colors ${
                  selectedOrder === opt.value
                    ? "bg-yellow-300 text-gray-900"
                    : "text-yellow-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFilter;
