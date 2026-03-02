import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BabyRain from './BabyRain';
import Gifts from './Gifts';
import EventInfo from './EventInfo';
import './App.css';

function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className={`container ${isLoaded ? 'loaded' : ''}`}>
        <main className="content">
          <header className="header">
            <div className="badge">Bienvenidos al baby shower de</div>
            <h1 className="title">
              Nicolás Alonso <span className="highlight">Liberman Arriaza</span>
            </h1>
            <p className="subtitle">Celebrando la llegada de nuestro retoño.</p>
          </header>

          <div className="grid">
            <Link to="/evento" className="card-link">
              <div className="card clickable">
                <h3>Información del Evento</h3>
                <p>Acompáñanos en una tarde maravillosa llena de amor, juegos y alegría. ¡No falten!</p>
                <span className="arrow">→</span>
              </div>
            </Link>
            <Link to="/regalos" className="card-link">
              <div className="card clickable">
                <h3>Lista de Regalos</h3>
                <p>Revisa nuestra lista de cositas para el nuevo integrante de la familia.</p>
                <span className="arrow">→</span>
              </div>
            </Link>
          </div>

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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/regalos" element={<Gifts />} />
        <Route path="/evento" element={<EventInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
