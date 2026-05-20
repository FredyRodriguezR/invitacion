import { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Gift,
  Heart,
  Users,
  MessageCircle,
  ExternalLink,
  Trophy,
  Mic,
  Utensils,
  Award,
  Music,
  Smile,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

// CONFIGURACIÓN DEL EVENTO - Modifica estos valores fácilmente
const EVENT_CONFIG = {
  graduateName: "Deyvis Steven Claros Molina",
  degreeTitle: "Licenciatura en Física",
  whatsappNumber: "573226194417", // Nequi / Número de contacto (Colombia)
  graduationDate: "2026-06-27T18:30:00", // Formato ISO para la cuenta regresiva (Llegada 6:30 PM)
  musicUrl: "/Don't Stop 'Til You Get Enough.mp3?v=2", // Canción del website con caché-busting
  bankDetails: {
    nequiNumber: "3226194417",
    brebKey: "@NEQUIDEY553",
    owner: "Deyvis Steven Claros"
  }
};

// Fotos para la galería de recuerdos (optimizadas para web móvil)
const GALLERY_PHOTOS = [
  { src: "/photos/D3.jpg", alt: "Recuerdo de graduación 1" },
  { src: "/photos/D4.jpg", alt: "Recuerdo de graduación 2" },
  { src: "/photos/D5.jpg", alt: "Recuerdo de graduación 3" },
  { src: "/photos/D6.jpg", alt: "Recuerdo de graduación 4" },
  { src: "/photos/D6_1.jpg", alt: "Recuerdo de graduación 5" },
  { src: "/photos/D7.jpg", alt: "Recuerdo de graduación 6" },
  { src: "/photos/D9.jpg", alt: "Recuerdo de graduación 7" },
  { src: "/photos/D10.jpg", alt: "Recuerdo de graduación 8" },
  { src: "/photos/D11.jpg", alt: "Recuerdo de graduación 9" },
  { src: "/photos/D12.jpg", alt: "Recuerdo de graduación 10" },
  { src: "/photos/D13.jpg", alt: "Recuerdo de graduación 11" }
];

// Componente individual de la galería con soporte para spinner y transición suave
function GalleryItem({ photo, onClick }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div 
      className="gallery-item"
      onClick={onClick}
    >
      {!loaded && (
        <div className="gallery-spinner-container">
          <div className="gallery-spinner"></div>
        </div>
      )}
      <img
        src={photo.src}
        alt={photo.alt}
        className="gallery-image"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease-in-out' }}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function App() {
  // --- Estados ---
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [attendance, setAttendance] = useState('yes'); // 'yes' | 'no'
  const [name, setName] = useState('');
  const [companions, setCompanions] = useState('0');
  const [message, setMessage] = useState('');
  const [copiedType, setCopiedType] = useState(''); // '' | 'nequi' | 'breb'
  const [isPlaying, setIsPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [particles, setParticles] = useState([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const [isLightboxLoading, setIsLightboxLoading] = useState(true);

  const audioRef = useRef(null);

  // --- Cuenta Regresiva ---
  function calculateTimeLeft() {
    const difference = +new Date(EVENT_CONFIG.graduationDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // --- Partículas Flotantes (Drifting Stars) ---
  useEffect(() => {
    const tempParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 6 + 3}px`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 8 + 12}s`
    }));
    setParticles(tempParticles);
  }, []);

  // --- Reproducción Automática con Interacción ---
  useEffect(() => {
    let hasPlayed = false;

    const startAudio = () => {
      if (hasPlayed) return;
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            hasPlayed = true;
            removeListeners();
          })
          .catch((err) => {
            console.log("Autoplay blocked by browser. Awaiting further interaction.", err);
          });
      }
    };

    const removeListeners = () => {
      document.removeEventListener('click', startAudio);
      document.removeEventListener('touchstart', startAudio);
      document.removeEventListener('scroll', startAudio);
    };

    document.addEventListener('click', startAudio);
    document.addEventListener('touchstart', startAudio);
    document.addEventListener('scroll', startAudio);

    return () => removeListeners();
  }, []);

  // --- Atajos de Teclado para la Galería Lightbox ---
  useEffect(() => {
    if (activePhotoIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActivePhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev + 1) % GALLERY_PHOTOS.length);
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex]);

  // --- Resetear estado de carga al cambiar de foto ---
  useEffect(() => {
    setIsLightboxLoading(true);
  }, [activePhotoIndex]);

  // --- Control de Música ---
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("El navegador bloqueó la reproducción automática al inicio. Se requiere interacción del usuario.", err);
        showToast("💡 Haz clic de nuevo para reproducir la música.");
      });
    }
  };

  // --- Copiar Detalles de Pago ---
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type);
      showToast(`✨ ¡${type === 'nequi' ? 'Número de Nequi' : 'Llave Bre-B'} copiado al portapapeles!`);
      setTimeout(() => setCopiedType(''), 3000);
    });
  };

  // --- Mostrar Toast Personalizado ---
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // --- Confirmar por WhatsApp ---
  const handleRSVPSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("⚠️ Por favor, ingresa tu nombre para confirmar.");
      return;
    }

    // Efecto de Confeti si asiste
    if (attendance === 'yes') {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#ffffff', '#1e3a8a']
      });
    }

    // Formatear Mensaje de WhatsApp
    const statusText = attendance === 'yes' ? 'Sí, asistiré con gusto 🎉' : 'Lamentablemente no podré asistir 😔';
    const companionsText = attendance === 'yes' ? `\n*Acompañantes:* ${companions}` : '';
    const wishText = message.trim() ? `\n*Mensaje:* "${message.trim()}"` : '';

    const whatsappMessage = `¡Hola ${EVENT_CONFIG.graduateName}! 👋 Confirmo mi asistencia a tu Gran Celebración 🥂.

*Nombre:* ${name.trim()}
*Asistencia:* ${statusText}${companionsText}${wishText}

¡Nos vemos pronto! ✨`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${EVENT_CONFIG.whatsappNumber}&text=${encodedMessage}`;

    showToast("🚀 Redirigiendo a WhatsApp...");
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 1500);
  };

  return (
    <>
      {/* Capa de fondo elegante */}
      <div className="bg-overlay"></div>

      {/* Partículas flotantes */}
      <div className="particles-container">
        {particles.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration
            }}
          />
        ))}
      </div>

      {/* REPRODUCTOR DE AUDIO HTML5 */}
      <audio
        ref={audioRef}
        src={EVENT_CONFIG.musicUrl}
        loop
      />

      {/* REPRODUCTOR FLOTANTE */}
      <div className="music-player-floating">
        <div className={`music-waves ${isPlaying ? 'active' : ''}`}>
          <div className="music-bar"></div>
          <div className="music-bar"></div>
          <div className="music-bar"></div>
          <div className="music-bar"></div>
          <div className="music-bar"></div>
        </div>
        <button
          className={`music-btn ${isPlaying ? 'playing' : ''}`}
          onClick={toggleMusic}
          title={isPlaying ? "Pausar música de fondo" : "Reproducir música de fondo"}
          aria-label="Reproducir música"
        >
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>

      {/* TOAST DE NOTIFICACIÓN */}
      {toastMessage && (
        <div className="toast-msg">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. SECCIÓN HÉROE */}
      <header className="hero-section">
        <div className="container hero-content">
          <div className="graduation-cap-icon">
            <GraduationCap size={64} strokeWidth={1.5} />
          </div>
          <p className="cursive-subtitle">Estás cordialmente invitado a celebrar la</p>
          <h2 className="serif-title" style={{ letterSpacing: '0.15em', fontSize: '1.8rem', fontWeight: 600 }}>
            Graduación de
          </h2>
          <h1 className="hero-name">{EVENT_CONFIG.graduateName}</h1>
          <h3 className="serif-title" style={{ letterSpacing: '0.08em', fontSize: '1.4rem', color: 'var(--gold-light)', textTransform: 'uppercase', marginTop: '-0.5rem', marginBottom: '1.5rem', fontWeight: 500 }}>
            {EVENT_CONFIG.degreeTitle}
          </h3>
          <p className="hero-desc">
            Un gran logro merece ser compartido con las personas más especiales. Acompáñame a celebrar la culminación de esta importante etapa y el inicio de mi camino profesional en el fascinante mundo de la física.
          </p>
          <a href="#rsvp" className="btn-gold">
            <Heart size={18} fill="currentColor" /> Confirmar Asistencia
          </a>
        </div>
      </header>

      {/* 2. SECCIÓN CUENTA REGRESIVA */}
      <section id="countdown" className="countdown-section">
        <div className="container">
          <div className="section-title-container">
            <p className="cursive-subtitle">Faltan</p>
            <h2 className="section-title">Cuenta Regresiva</h2>
          </div>
          <div className="countdown-container">
            <div className="countdown-box">
              <div className="countdown-num">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="countdown-label">Días</div>
            </div>
            <div className="countdown-box">
              <div className="countdown-num">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="countdown-label">Horas</div>
            </div>
            <div className="countdown-box">
              <div className="countdown-num">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="countdown-label">Minutos</div>
            </div>
            <div className="countdown-box">
              <div className="countdown-num">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="countdown-label">Segundos</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN DETALLES DEL EVENTO */}
      <section id="details" className="details-section">
        <div className="container">
          <div className="section-title-container">
            <p className="cursive-subtitle">¿Dónde y Cuándo?</p>
            <h2 className="section-title">Detalles del Evento</h2>
          </div>

          <div className="details-single-container">
            <div className="glass-card details-single-card">
              <div className="details-icon-wrapper" style={{ animation: 'float 4s ease-in-out infinite' }}>
                <Heart size={32} />
              </div>
              <h3>Recepción & Celebración</h3>
              <div className="details-divider"></div>
              <ul className="details-info-list" style={{ maxWidth: '500px' }}>
                <li className="details-info-item">
                  <Calendar size={20} />
                  <span>Sábado, 27 de Junio de 2026</span>
                </li>
                <li className="details-info-item">
                  <Clock size={20} />
                  <span>7:00 PM - 2:30 AM</span>
                </li>
                <li className="details-info-item">
                  <MapPin size={20} />
                  <div>
                    <span className="details-place-name">Salón Comunal de Asovivir</span>
                    <br />
                    <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Cl. 68b Sur #80m-49, Bosa, Bogotá</span>
                  </div>
                </li>
              </ul>
              <a
                href="https://maps.app.goo.gl/uqFeb9r98BA2hamN7"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
                style={{ marginTop: '1rem', padding: '12px 24px' }}
              >
                Ver en Google Maps <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN ITINERARIO */}
      <section id="itinerary" className="itinerary-section" style={{ background: 'rgba(2, 6, 23, 0.4)' }}>
        <div className="container">
          <div className="section-title-container">
            <p className="cursive-subtitle">¿Qué haremos?</p>
            <h2 className="section-title">Itinerario del Evento</h2>
          </div>

          <div className="timeline-container">
            {/* Item 1 */}
            <div className="timeline-item">
              <div className="timeline-icon-box">
                <Users size={20} />
              </div>
              <div className="timeline-content-card">
                <span className="timeline-time-badge">6:30 PM</span>
                <h3 className="timeline-title">Llegada & Recibimiento</h3>
                <p className="timeline-desc">
                  Bienvenida a los invitados y organización inicial para disfrutar de una noche inolvidable.
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="timeline-item">
              <div className="timeline-icon-box">
                <Trophy size={20} />
              </div>
              <div className="timeline-content-card">
                <span className="timeline-time-badge">7:00 PM - 8:30 PM</span>
                <h3 className="timeline-title">Inicio de Fiesta / Partido</h3>
                <p className="timeline-desc">
                  ¡Que ruede el balón y empiece la diversión! Disfrutaremos del emocionante partido de fútbol de integración y llegada de invitados.
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="timeline-item">
              <div className="timeline-icon-box">
                <Mic size={20} />
              </div>
              <div className="timeline-content-card">
                <span className="timeline-time-badge">8:30 PM - 9:00 PM</span>
                <h3 className="timeline-title">Palabras Emotivas</h3>
                <p className="timeline-desc">
                  Un momento para compartir y brindar por este logro.
                </p>
              </div>
            </div>

            {/* Item 4 */}
            <div className="timeline-item">
              <div className="timeline-icon-box">
                <Utensils size={20} />
              </div>
              <div className="timeline-content-card">
                <span className="timeline-time-badge">9:00 PM - 10:00 PM</span>
                <h3 className="timeline-title">Comida / Cena</h3>
                <p className="timeline-desc">
                  Momento para deleitarnos con una deliciosa cena de celebración y compartir anécdotas en la mesa.
                </p>
              </div>
            </div>

            {/* Item 5 */}
            <div className="timeline-item">
              <div className="timeline-icon-box">
                <Award size={20} />
              </div>
              <div className="timeline-content-card">
                <span className="timeline-time-badge">10:00 PM - 11:00 PM</span>
                <h3 className="timeline-title">Gran Bingo</h3>
                <p className="timeline-desc">
                  ¡A jugar y a ganar! Divertido bingo con fabulosos premios y sorpresas para todos los presentes.
                </p>
              </div>
            </div>

            {/* Item 6 */}
            <div className="timeline-item">
              <div className="timeline-icon-box">
                <Smile size={20} />
              </div>
              <div className="timeline-content-card">
                <span className="timeline-time-badge">11:00 PM - 12:00 AM</span>
                <h3 className="timeline-title">Actividad de Integración</h3>
                <p className="timeline-desc">
                  Momento de risas y juegos para recordar los viejos tiempos.
                </p>
              </div>
            </div>

            {/* Item 7 */}
            <div className="timeline-item">
              <div className="timeline-icon-box">
                <Music size={20} />
              </div>
              <div className="timeline-content-card">
                <span className="timeline-time-badge">12:00 AM - 2:30 AM</span>
                <h3 className="timeline-title">Súper Fiesta & Baile</h3>
                <p className="timeline-desc">
                  ¡A bailar sin parar! Cerramos con broche de oro con música, luces y la mejor energía para celebrar en grande.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN RSVP (CONFIRMACIÓN DE ASISTENCIA) */}
      <section id="rsvp" className="rsvp-section">
        <div className="container">
          <div className="section-title-container">
            <p className="cursive-subtitle">El honor de tu presencia</p>
            <h2 className="section-title">Confirmar Asistencia</h2>
          </div>

          <div className="glass-card rsvp-card">
            <p className="rsvp-intro">
              Por favor, ayúdame a organizar de la mejor manera confirmando tu asistencia antes del <strong>15 de Junio de 2026</strong>. Rellena el formulario y envíame tu confirmación directa por WhatsApp.
            </p>

            <form onSubmit={handleRSVPSubmit}>
              {/* Nombre */}
              <div className="form-group">
                <label className="form-label" htmlFor="guest-name">Nombre Completo</label>
                <input
                  type="text"
                  id="guest-name"
                  className="form-input"
                  placeholder="Ej. Juan Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                {/* ¿Asistirá? */}
                <div className="form-group">
                  <label className="form-label">¿Confirmas Asistencia?</label>
                  <div className="attendance-toggle">
                    <div className="toggle-option">
                      <input
                        type="radio"
                        id="attendance-yes"
                        name="attendance"
                        value="yes"
                        checked={attendance === 'yes'}
                        onChange={() => setAttendance('yes')}
                      />
                      <label htmlFor="attendance-yes" className="toggle-label">
                        🎉 Sí, asistiré
                      </label>
                    </div>
                    <div className="toggle-option">
                      <input
                        type="radio"
                        id="attendance-no"
                        name="attendance"
                        value="no"
                        checked={attendance === 'no'}
                        onChange={() => setAttendance('no')}
                      />
                      <label htmlFor="attendance-no" className="toggle-label">
                        😔 No podré ir
                      </label>
                    </div>
                  </div>
                </div>

                {/* Acompañantes */}
                <div className="form-group">
                  <label className="form-label" htmlFor="companions-select">Acompañantes</label>
                  <select
                    id="companions-select"
                    className="form-select"
                    value={companions}
                    onChange={(e) => setCompanions(e.target.value)}
                    disabled={attendance === 'no'}
                  >
                    <option value="0">Solo yo (0 acompañantes)</option>
                    <option value="1">1 Acompañante</option>
                    <option value="2">2 Acompañantes</option>
                    <option value="3">3 Acompañantes</option>
                    <option value="4">4 Acompañantes</option>
                  </select>
                </div>
              </div>

              {/* Mensaje */}
              <div className="form-group">
                <label className="form-label" htmlFor="wishes-textarea">Mensaje de Felicitación (Opcional)</label>
                <textarea
                  id="wishes-textarea"
                  className="form-textarea"
                  placeholder="Escribe tus buenos deseos o felicitaciones aquí..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Botón enviar por WhatsApp */}
              <div className="rsvp-button-wrapper">
                <button type="submit" className="btn-gold btn-whatsapp">
                  <MessageCircle size={20} fill="currentColor" /> Enviar por WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN DE GALERÍA DE FOTOS */}
      <section id="gallery" className="gallery-section">
        <div className="container">
          <div className="section-title-container">
            <p className="cursive-subtitle">El camino recorrido</p>
            <h2 className="section-title">Galería de Recuerdos</h2>
          </div>

          <div className="gallery-grid">
            {GALLERY_PHOTOS.map((photo, index) => (
              <GalleryItem
                key={index}
                photo={photo}
                onClick={() => setActivePhotoIndex(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. SECCIÓN REGALOS (LLUVIA DE SOBRES / REGALO EN EFECTIVO) */}
      <section id="gifts" className="gifts-section">
        <div className="container">
          <div className="section-title-container">
            <p className="cursive-subtitle">Detalles de regalo</p>
            <h2 className="section-title">Regalos & Detalles</h2>
          </div>

          <div className="glass-card gifts-card">
            <div className="gifts-icon-wrapper">
              <Gift size={48} strokeWidth={1.5} />
            </div>
            <p className="gifts-text">
              Tu presencia y tus felicitaciones son mi mejor regalo para este día. Sin embargo, si deseas hacerme un presente, mi evento contará con la modalidad de <strong>Lluvia de Sobres</strong>. También te facilito mis métodos de pago electrónico para regalos en efectivo en caso de que lo prefieras.
            </p>

            <div className="bank-details-box" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <span className="bank-detail-label" style={{ fontSize: '0.9rem', color: 'var(--gold-light)' }}>Titular del Regalo</span>
                <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>{EVENT_CONFIG.bankDetails.owner}</p>
              </div>

              <div className="payment-grid">
                {/* Nequi Card */}
                <div style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span className="bank-detail-label" style={{ fontSize: '0.75rem' }}>Número Nequi</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {EVENT_CONFIG.bankDetails.nequiNumber}
                    <button
                      onClick={() => copyToClipboard(EVENT_CONFIG.bankDetails.nequiNumber, 'nequi')}
                      className="btn-copy"
                      title="Copiar número Nequi"
                    >
                      {copiedType === 'nequi' ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} />}
                    </button>
                  </span>
                </div>

                {/* Llave Bre-B Card */}
                <div style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <span className="bank-detail-label" style={{ fontSize: '0.75rem' }}>Llave Bre-B</span>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {EVENT_CONFIG.bankDetails.brebKey}
                    <button
                      onClick={() => copyToClipboard(EVENT_CONFIG.bankDetails.brebKey, 'breb')}
                      className="btn-copy"
                      title="Copiar Llave Bre-B"
                    >
                      {copiedType === 'breb' ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} />}
                    </button>
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>📱 Este número de Nequi es también mi contacto de WhatsApp para cualquier duda que tengas.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN PIE DE PÁGINA */}
      <footer className="footer-section">
        <div className="container">
          <p className="footer-cursive">¡Te espero para celebrar juntos!</p>
          <p className="footer-quote">
            "El futuro pertenece a quienes creen en la belleza de sus sueños." — Eleanor Roosevelt
          </p>
          <div className="details-icon-wrapper" style={{ margin: '0 auto 1.5rem', width: '40px', height: '40px', color: 'var(--gold-primary)' }}>
            <Heart size={20} fill="currentColor" />
          </div>
          <p className="footer-copyright">
            Invitación de Graduación © {new Date().getFullYear()} — Diseñada con cariño
          </p>
        </div>
      </footer>

      {/* --- Lightbox Modal --- */}
      {activePhotoIndex !== null && (
        <div 
          className="lightbox-modal"
          onClick={() => setActivePhotoIndex(null)}
        >
          <button 
            className="lightbox-close"
            onClick={(e) => {
              e.stopPropagation();
              setActivePhotoIndex(null);
            }}
            aria-label="Cerrar galería"
          >
            <X size={24} />
          </button>

          <button 
            className="lightbox-nav-btn prev"
            onClick={(e) => {
              e.stopPropagation();
              setActivePhotoIndex((prev) => (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length);
            }}
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-image-wrapper" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isLightboxLoading && (
                <div className="lightbox-spinner-container">
                  <div className="lightbox-spinner"></div>
                </div>
              )}
              <img 
                src={GALLERY_PHOTOS[activePhotoIndex].src} 
                alt={GALLERY_PHOTOS[activePhotoIndex].alt} 
                className="lightbox-image"
                style={{ opacity: isLightboxLoading ? 0 : 1, transition: 'opacity 0.3s ease-in-out' }}
                onLoad={() => setIsLightboxLoading(false)}
              />
            </div>
          </div>

          <button 
            className="lightbox-nav-btn next"
            onClick={(e) => {
              e.stopPropagation();
              setActivePhotoIndex((prev) => (prev + 1) % GALLERY_PHOTOS.length);
            }}
            aria-label="Siguiente imagen"
          >
            <ChevronRight size={28} />
          </button>

          <div className="lightbox-caption-panel" onClick={(e) => e.stopPropagation()}>
            <span className="lightbox-counter">
              {activePhotoIndex + 1} de {GALLERY_PHOTOS.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
