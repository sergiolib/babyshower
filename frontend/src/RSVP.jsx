import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BabyRain from './BabyRain';
import './App.css';

function RSVP() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className={`container ${isLoaded ? 'loaded' : ''}`}>
        <main className="content">
          <Link to="/" className="back-link">
            ← Volver al inicio
          </Link>
          
          <header className="header">
            <h1 className="title">
              Confirmar <span className="highlight">Asistencia</span>
            </h1>
            <p className="subtitle">Próximamente...</p>
          </header>

          <footer className="footer">
            <p>&copy; 2026 Romina Arriaza y Sergio Liberman</p>
          </footer>
        </main>
      </div>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <BabyRain />
    </>
  );
}

export default RSVP;
