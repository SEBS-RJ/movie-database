import React, { useState } from 'react';
import { FaPlay } from 'react-icons/fa';

// Función para extraer el ID de YouTube desde una URL.
const extractYouTubeID = (url) => {
  const regex = /^(?:.*(?:youtu\.be\/|v\/|u\/\w+\/|embed\/|watch\?v=|&v=))([^#&?]+).*/;
  const match = url.match(regex);
  return (match && match[1].length === 11) ? match[1] : null;
};

const TrailerSection = ({ trailerUrl }) => {
  const videoId = trailerUrl ? extractYouTubeID(trailerUrl) : null;
  const [playVideo, setPlayVideo] = useState(false);

  if (!videoId) return null;

  // URL de la miniatura de YouTube
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="relative w-full mb-4" 
    style={{ paddingBottom: '60%' }}
    >
      {!playVideo ? (
        <div 
          className="absolute inset-0 cursor-pointer" 
          onClick={() => setPlayVideo(true)}
        >
          <img 
            src={thumbnailUrl} 
            alt="Miniatura del tráiler" 
            className="absolute inset-0 w-full h-full object-cover rounded-lg" 
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-black bg-opacity-60 p-4 rounded-full shadow-lg flex items-center justify-center">
              <FaPlay className="text-yellow-300 text-3xl" />
            </button>
          </div>
        </div>
      ) : (
        <iframe
          title="Tráiler"
          className="absolute inset-0 w-full h-full rounded-lg shadow-lg"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default TrailerSection;
