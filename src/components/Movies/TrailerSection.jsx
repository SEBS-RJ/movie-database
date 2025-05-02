// movie-database/src/components/Movies/TrailerSection.jsx
import React, { useState } from 'react';

// Función para extraer el ID de YouTube a partir de la URL.
const extractYouTubeID = (url) => {
  const regExp = new RegExp('^.*(youtu\\.be\\/|v\\/|u\\/\\w\\/|embed\\/|watch\\?v=|&v=)([^#&?]*).*');
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const TrailerSection = ({ trailerUrl }) => {
  const videoId = trailerUrl ? extractYouTubeID(trailerUrl) : null;
  const [showTrailer, setShowTrailer] = useState(false);

  if (!videoId) return null;

  // URL de la miniatura de YouTube
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="trailer-section mt-6">
      {!showTrailer ? (
        // En modo preview, eliminamos las clases que limitaban el ancho (como md:w-1/2)
        <div 
          className="cursor-pointer relative w-full" 
          onClick={() => setShowTrailer(true)}
        >
          <img 
            src={thumbnailUrl} 
            alt="Miniatura del tráiler" 
            className="w-full object-cover rounded"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="px-4 py-2 bg-yellow-300 text-gray-900 rounded">
              Ver Tráiler
            </button>
          </div>
        </div>
      ) : (
        // En modo reproducción, se utiliza el contenedor padre para definir el ancho.
        <div className="relative w-full">
          {/* El contenedor "aspect-video" mantiene la relación de aspecto 16:9 */}
          <div className="aspect-video overflow-hidden rounded shadow-lg">
            <iframe
              title="Trailer"
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrailerSection;
