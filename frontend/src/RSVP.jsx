import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BabyRain from './BabyRain';
import './App.css';

function RSVP() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    partySize: '1'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('Hubo un error al confirmar tu asistencia. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Hubo un error al confirmar tu asistencia. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <div className={`container ${isLoaded ? 'loaded' : ''}`}>
          <main className="content">
            <div className="card success-card">
              <div className="event-icon">🎉</div>
              <h2>¡Muchas gracias!</h2>
              <p>Tu asistencia ha sido confirmada. ¡Nos vemos pronto!</p>
              <Link to="/" className="btn-confirm" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none', marginTop: '1rem' }}>
                Volver al inicio
              </Link>
            </div>
          </main>
        </div>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <BabyRain />
      </>
    );
  }

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
            <p className="subtitle">Por favor completa tus datos para confirmar tu asistencia.</p>
          </header>

          <div className="card rsvp-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nombre Completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Nicolás Liberman"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+56 9 1234 5678"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="partySize">Número de Personas</label>
                <select
                  id="partySize"
                  name="partySize"
                  value={formData.partySize}
                  onChange={handleChange}
                  className="form-input"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Persona' : 'Personas'}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-confirm" disabled={isSubmitting} style={{ width: '100%', marginTop: '1rem' }}>
                {isSubmitting ? 'Confirmando...' : 'Confirmar Asistencia'}
              </button>
            </form>
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

export default RSVP;
