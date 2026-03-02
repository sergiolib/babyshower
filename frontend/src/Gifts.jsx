import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BabyRain from './BabyRain';
import confetti from 'canvas-confetti';

function Gifts() {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGift, setSelectedGift] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedName, setConfirmedName] = useState(''); // Estado para el mensaje final
  const [formData, setFormData] = useState({
    nombre: '',
    whatsapp: '',
    mensaje: ''
  });

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = () => {
    setLoading(true);
    const backendUrl = import.meta.env.MODE === 'development' 
      ? 'http://localhost:5001/api/gifts' 
      : '/api/gifts';

    fetch(backendUrl)
      .then(res => res.json())
      .then(data => {
        setGifts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const triggerFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 3000 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const isValidLink = (str) => {
    if (!str) return false;
    const trimmed = str.trim();
    return trimmed.startsWith('http') || trimmed.startsWith('data:') || trimmed.includes('.');
  };

  const handleReserveClick = (gift) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGift(null);
    setFormData({ nombre: '', whatsapp: '', mensaje: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const backendUrl = import.meta.env.MODE === 'development' 
      ? 'http://localhost:5001/api/reserve' 
      : '/api/reserve';

    fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        giftName: selectedGift.name,
        ...formData
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setConfirmedName(formData.nombre);
        closeModal();
        triggerFireworks();
        fetchGifts();
      } else {
        alert('Error al reservar: ' + data.error);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error de conexión con el servidor.');
    })
    .finally(() => {
      setSubmitting(false);
    });
  };

  return (
    <>
      <div className="container loaded">
        <Link to="/" className="back-link">← Volver al inicio</Link>
        <header className="header">
          <h1 className="title">Lista de <span className="highlight">Regalos</span></h1>
          <p className="subtitle">Ayúdanos a prepararnos para la llegada de Nico.</p>
        </header>

        {loading ? (
          <div className="loading">Cargando lista...</div>
        ) : (
          <div className="gifts-grid">
            {gifts.length > 0 ? (
              gifts.map((gift, index) => (
                <div key={index} className={`card gift-card ${gift.reserved ? 'reserved' : ''}`}>
                  <div className="gift-image-wrapper">
                    <img 
                      src={isValidLink(gift.image) ? gift.image.trim() : `https://placehold.co/400x400/e8f5e9/4caf50?text=🎁`} 
                      alt={gift.name} 
                      className="gift-image" 
                      onError={(e) => { e.target.src = 'https://placehold.co/400x400/e8f5e9/4caf50?text=🎁' }}
                    />
                  </div>
                  <div className="gift-info">
                    <h3>{gift.name}</h3>
                    {(isValidLink(gift.link) || isValidLink(gift.description)) && (
                      <a 
                        href={(gift.link || gift.description).trim()} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="store-link"
                      >
                        🛒 Ver en tienda
                      </a>
                    )}
                  </div>
                  {gift.reserved ? (
                    <span className="badge reserved-badge">Ya Reservado</span>
                  ) : gift.showReserveButton ? (
                    <button className="reserve-btn" onClick={() => handleReserveClick(gift)}>
                      Reservar
                    </button>
                  ) : null}
                </div>
              ))
            ) : (
              <p className="no-gifts">No hay regalos en la lista todavía.</p>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Reservar Regalo</h2>
            <span className="gift-name">{selectedGift?.name}</span>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tu Nombre</label>
                <input 
                  type="text" 
                  name="nombre" 
                  required 
                  placeholder="Ej: Romina Arriaza"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>WhatsApp</label>
                <input 
                  type="tel" 
                  name="whatsapp" 
                  required 
                  placeholder="Ej: +569 1234 5678"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Mensaje para los papás (opcional)</label>
                <textarea 
                  name="mensaje" 
                  rows="3" 
                  placeholder="¡Escribe un lindo mensaje!"
                  value={formData.mensaje}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn-confirm" disabled={submitting}>
                  {submitting ? 'Reservando...' : 'Confirmar Reserva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmedName && (
        <div className="success-overlay">
          <div className="success-content">
            <h2>🎉 ¡Reservado!</h2>
            <p>Gracias <strong>{confirmedName}</strong>, ¡nos vemos en el magno evento!</p>
            <p className="signature">Nico, Romina, Sergio</p>
            <button className="btn-close-success" onClick={() => setConfirmedName('')}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Elementos de fondo fuera del contenedor transformado */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <BabyRain />
    </>
  );
}

export default Gifts;

