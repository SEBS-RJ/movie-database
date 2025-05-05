// tailwind.config.js
/* eslint-disable */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Ruta a todos los archivos dentro de src/
  ],
  theme: {
    extend: {
      // Tus extensiones de tema, por ejemplo, colores personalizados
      colors: {
        'imdb-yellow': '#F5C518'
      },
    },
  },
  plugins: [    
    require('@tailwindcss/aspect-ratio'),   // Plugin para relaciones de aspecto
  ],
};
