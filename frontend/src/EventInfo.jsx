import { Link } from 'react-router-dom';
import BabyRain from './BabyRain';

function EventInfo() {
  return (
    <>
      <div className="container loaded">
        <Link to="/" className="back-link">← Volver al inicio</Link>
        <header className="header">
          <h1 className="title">Información del <span className="highlight">Evento</span></h1>
          <p className="subtitle">Todo lo que necesitas saber para acompañarnos.</p>
        </header>

        <div className="event-details">
          <div className="card event-card-detail">
            <div className="event-icon">🍳</div>
            <h3> Brunch de Celebración</h3>
            <p>Disfrutaremos de una mañana deliciosa mientras celebramos la pronta llegada de Nico.</p>
          </div>

          <div className="grid">
            <div className="card event-info-card">
              <div className="event-icon">📅</div>
              <h3>Cuándo</h3>
              <p>Domingo, 29 de Marzo de 2026</p>
              <p className="event-time">11:00 AM</p>
            </div>

            <div className="card event-info-card">
              <div className="event-icon">📍</div>
              <h3>Dónde</h3>
              <p>Salón de Eventos</p>
              <p>Dublé Almeyda 2621, Ñuñoa</p>
              <p>Santiago, Chile</p>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Duble+Almeyda+2621,Nuñoa,Santiago,Chile" 
                target="_blank" 
                rel="noopener noreferrer"
                className="map-link"
              >
                Ver en Google Maps
              </a>
            </div>
          </div>
          
          <div className="card event-card-detail">
            <div className="event-icon">🚗</div>
            <h3>Estacionamiento</h3>
            <p>El edificio cuenta con pocos estacionamientos de visita disponibles. Sin embargo, al ser domingo por la mañana, deberían encontrar espacios fácilmente en las calles aledañas.</p>
          </div>

          <div className="card note-card">
            <p><strong>Nota:</strong> Tu presencia es nuestro mejor regalo, pero si deseas hacernos un presente, puedes revisar nuestra <Link to="/regalos" className="inline-link">lista de regalos</Link>.</p>
          </div>
        </div>
      </div>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <BabyRain />
    </>
  );
}

export default EventInfo;
