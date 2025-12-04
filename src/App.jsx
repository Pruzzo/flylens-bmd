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

          {/* Contact Info Section */}
          <div className="contact-info-box">
            <div className="contact-icon">📱</div>
            <h3>Hai Bisogno di Maggiori Informazioni?</h3>
            <p>Contattaci direttamente su Instagram per qualsiasi domanda o chiarimento</p>
            <a 
              href="https://www.instagram.com/flylens.it/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="instagram-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Seguici su Instagram @flylens.it
            </a>
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
