import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    carDescription: '',
    contact: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      // Salva i dati su Firestore
      await addDoc(collection(db, 'requests'), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        carDescription: formData.carDescription,
        contact: formData.contact,
        timestamp: serverTimestamp()
      })

      setSubmitMessage('✓ Richiesta inviata con successo! Riceverai presto l\'anteprima del tuo video.')
      setFormData({
        firstName: '',
        lastName: '',
        carDescription: '',
        contact: ''
      })
    } catch (error) {
      console.error('Errore:', error)
      setSubmitMessage('✗ Errore nell\'invio. Riprova più tardi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app">
      {/* Hero Video Section */}
      <section className="hero-section">
        <div className="video-container">
          <iframe
            src="https://www.youtube.com/embed/K0GxZo4k2UQ?autoplay=1&mute=1&loop=1&playlist=K0GxZo4k2UQ&controls=0&modestbranding=1&rel=0"
            title="Busalla Motor Day - Flylens Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="hero-overlay">
          <div className="logos">
            <div className="logo-item">
              <img src="/logo-bmd.png" alt="Busalla Motor Day" className="logo-image" />
            </div>
            <div className="logo-separator">&</div>
            <div className="logo-item">
              <img src="/logo-flylens.png" alt="Flylens" className="logo-image" />
            </div>
          </div>
          <h1 className="hero-title">Video Aereo del Tuo Evento</h1>
          <p className="hero-subtitle">Riprese professionali con drone del Busalla Motor Day 2025</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section">
        <div className="container">
          <div className="info-box">
            <h2>Il Tuo Momento dall'Alto</h2>
            <p>
              Hai partecipato al <strong>Busalla Motor Day</strong>? La tua auto è stata ripresa dalle nostre camere aeree!
            </p>
            <p>
              <strong>Flylens</strong> ha catturato l'evento con riprese professionali in drone. 
              Richiedi ora un'<strong>anteprima gratuita</strong> del video della tua auto in azione.
            </p>
          </div>

          {/* Form */}
          <div className="form-container">
            <h3>Richiedi la Tua Anteprima Gratuita</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Nome *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Cognome *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="carDescription">Descrizione Auto *</label>
                <textarea
                  id="carDescription"
                  name="carDescription"
                  value={formData.carDescription}
                  onChange={handleChange}
                  placeholder="Es: Lancia Delta Integrale rossa, targa XX123YZ"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="contact">Email o Telefono *</label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="tuo@email.com o 333 1234567"
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Invio in corso...' : 'Richiedi Anteprima Gratuita'}
              </button>

              {submitMessage && (
                <div className={`message ${submitMessage.includes('✓') ? 'success' : 'error'}`}>
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="https://busallamotorday.com/" target="_blank" rel="noopener noreferrer">
              Busalla Motor Day
            </a>
            <span>•</span>
            <a href="https://www.instagram.com/flylens.it/" target="_blank" rel="noopener noreferrer">
              @flylens.it
            </a>
          </div>
          <p>© 2025 Flylens - Video Aereo Professionale</p>
        </div>
      </footer>
    </div>
  )
}

export default App
