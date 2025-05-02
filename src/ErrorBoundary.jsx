// src/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    // Actualiza el estado para que la siguiente renderización muestre la UI de error.
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // Puedes registrar el error para un seguimiento (logging)
    console.error("ErrorBoundary capturó un error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      // Renderiza una UI de fallback en caso de error.
      return (
        <div className="flex justify-center items-center min-h-screen bg-red-600 text-white">
          <h2>
            Ocurrió un error: {this.state.error && this.state.error.toString()}
          </h2>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
