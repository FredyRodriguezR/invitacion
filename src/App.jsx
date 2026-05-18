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
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

// CONFIGURACIÓN DEL EVENTO - Modifica estos valores fácilmente
const EVENT_CONFIG = {
  graduateName: "Deyvis",
  degreeTitle: "Profesional de Excelencia",
  whatsappNumber: "573000000000", // Código de país + número (ejemplo: 57 para Colombia)
  graduationDate: "2026-07-17T17:00:00", // Formato ISO para la cuenta regresiva
  musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", // Melodía instrumental elegante
  bankDetails: {
    bank: "Banco Davivienda",
    accountType: "Ahorros",
    accountNumber: "987-654321-09",
    owner: "Deyvis Rodríguez",
    identification: "CC. 123.456.789"
  }
};

function App() {
  // --- Estados ---
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [attendance, setAttendance] = useState('yes'); // 'yes' | 'no'
  const [name, setName] = useState('');
  const [companions, setCompanions] = useState('0');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [particles, setParticles] = useState([]);

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

  // --- Control de Música ---
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.log("El navegador bloqueó la reproducción automática al inicio. Se requiere interacción del usuario.", err);
        showToast("💡 Haz clic de nuevo para reproducir la música.");
      });
    }
    setIsPlaying(!isPlaying);
  };

  // --- Copiar Detalles Bancarios ---
  const copyToClipboard = () => {
    const textToCopy = `Banco: ${EVENT_CONFIG.bankDetails.bank}\nTipo: ${EVENT_CONFIG.bankDetails.accountType}\nCuenta: ${EVENT_CONFIG.bankDetails.accountNumber}\nTitular: ${EVENT_CONFIG.bankDetails.owner}\nDocumento: ${EVENT_CONFIG.bankDetails.identification}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      showToast("✨ ¡Datos de cuenta copiados al portapapeles!");
      setTimeout(() => setCopied(false), 3000);
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

    const whatsappMessage = `¡Hola ${EVENT_CONFIG.graduateName}! 👋 Confirmo mi asistencia al evento de tu Graduación 🎓.

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
          <p className="hero-desc">
            Un gran logro merece ser compartido con las personas más especiales. Acompáñame a celebrar la culminación de esta importante etapa y el inicio de un nuevo camino profesional.
          </p>
          <a href="#rsvp" className="btn-gold">
            <Heart size={18} fill="currentColor" /> Confirmar Asistencia
          </a>
        </div>
        <a href="#countdown" className="scroll-indicator">
          <span>Descubrir más</span>
          <div className="scroll-mouse"></div>
        </a>
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

          <div className="details-grid">
            {/* Ceremonia */}
            <div className="glass-card details-card">
              <div className="details-icon-wrapper">
                <GraduationCap size={32} />
              </div>
              <h3>Ceremonia de Grado</h3>
              <div className="details-divider"></div>
              <ul className="details-info-list">
                <li className="details-info-item">
                  <Calendar size={18} />
                  <span>Viernes, 17 de Julio de 2026</span>
                </li>
                <li className="details-info-item">
                  <Clock size={18} />
                  <span>5:00 PM (Hora Exacta)</span>
                </li>
                <li className="details-info-item">
                  <MapPin size={18} />
                  <div>
                    <span className="details-place-name">Auditorio Central Universitario</span>
                    <br />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Av. Universitaria #45-12, Ciudad Principal</span>
                  </div>
                </li>
              </ul>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-outline"
                style={{ marginTop: 'auto' }}
              >
                Ver en Google Maps <ExternalLink size={16} />
              </a>
            </div>

            {/* Recepción */}
            <div className="glass-card details-card">
              <div className="details-icon-wrapper">
                <Heart size={32} />
              </div>
              <h3>Recepción & Celebración</h3>
              <div className="details-divider"></div>
              <ul className="details-info-list">
                <li className="details-info-item">
                  <Calendar size={18} />
                  <span>Viernes, 17 de Julio de 2026</span>
                </li>
                <li className="details-info-item">
                  <Clock size={18} />
                  <span>8:00 PM en adelante</span>
                </li>
                <li className="details-info-item">
                  <MapPin size={18} />
                  <div>
                    <span className="details-place-name">Salón de Eventos Terraza Dorada</span>
                    <br />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Calle de la Fiesta #12-84, Sector Exclusivo</span>
                  </div>
                </li>
              </ul>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-outline"
                style={{ marginTop: 'auto' }}
              >
                Ver en Google Maps <ExternalLink size={16} />
              </a>
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
              Por favor, ayúdame a organizar de la mejor manera confirmando tu asistencia antes del <strong>05 de Julio de 2026</strong>. Rellena el formulario y envíame tu confirmación directa por WhatsApp.
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
            <div className="gallery-item">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop" 
                alt="Celebración del grado" 
                className="gallery-image"
                loading="lazy"
              />
              <div className="gallery-overlay">
                <span className="gallery-caption">Meta Alcanzada 🎓</span>
              </div>
            </div>
            <div className="gallery-item">
              <img 
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop" 
                alt="Graduación y éxito" 
                className="gallery-image"
                loading="lazy"
              />
              <div className="gallery-overlay">
                <span className="gallery-caption">Esfuerzo y Pasión ✨</span>
              </div>
            </div>
            <div className="gallery-item">
              <img 
                src="https://images.unsplash.com/photo-1525921429573-0aa88b86b973?q=80&w=600&auto=format&fit=crop" 
                alt="Diploma y toga" 
                className="gallery-image"
                loading="lazy"
              />
              <div className="gallery-overlay">
                <span className="gallery-caption">El Comienzo del Futuro 🌟</span>
              </div>
            </div>
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
              Tu presencia y tus felicitaciones son mi mejor regalo para este día. Sin embargo, si deseas hacerme un presente, mi evento contará con la modalidad de <strong>Lluvia de Sobres</strong>. También te facilito mi cuenta bancaria para transferencias en caso de que lo prefieras.
            </p>

            <div className="bank-details-box">
              <div className="bank-detail-row">
                <span className="bank-detail-label">Banco</span>
                <span className="bank-detail-value">{EVENT_CONFIG.bankDetails.bank}</span>
              </div>
              <div className="bank-detail-row">
                <span className="bank-detail-label">Tipo de Cuenta</span>
                <span className="bank-detail-value">{EVENT_CONFIG.bankDetails.accountType}</span>
              </div>
              <div className="bank-detail-row">
                <span className="bank-detail-label">Número de Cuenta</span>
                <span className="bank-detail-value">
                  {EVENT_CONFIG.bankDetails.accountNumber}
                  <button 
                    onClick={copyToClipboard}
                    className="btn-copy"
                    title="Copiar número de cuenta"
                  >
                    {copied ? <Check size={16} strokeWidth={2.5} /> : <Copy size={16} />}
                  </button>
                </span>
              </div>
              <div className="bank-detail-row">
                <span className="bank-detail-label">Titular</span>
                <span className="bank-detail-value">{EVENT_CONFIG.bankDetails.owner}</span>
              </div>
              <div className="bank-detail-row">
                <span className="bank-detail-label">Identificación</span>
                <span className="bank-detail-value">{EVENT_CONFIG.bankDetails.identification}</span>
              </div>

              {copied && <span className="copy-toast">¡Copiado! 📋</span>}
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
    </>
  );
}

export default App;
