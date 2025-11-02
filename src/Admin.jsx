import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import './Admin.css';

function Admin() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se l'utente è loggato
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    fetchRequests();
  }, [navigate]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'requests'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(data);
    } catch (error) {
      console.error('Errore nel caricamento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa richiesta?')) {
      try {
        await deleteDoc(doc(db, 'requests', id));
        setRequests(requests.filter(req => req.id !== id));
      } catch (error) {
        console.error('Errore eliminazione:', error);
        alert('Errore durante l\'eliminazione');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/login');
  };

  const filteredRequests = requests.filter(req => 
    req.firstName?.toLowerCase().includes(filter.toLowerCase()) ||
    req.lastName?.toLowerCase().includes(filter.toLowerCase()) ||
    req.carDescription?.toLowerCase().includes(filter.toLowerCase()) ||
    req.contact?.toLowerCase().includes(filter.toLowerCase())
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <div>
            <h1>📊 Dashboard Admin</h1>
            <p>Busalla Motor Day × Flylens - Richieste Video</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-controls">
          <div className="stats">
            <div className="stat-card">
              <span className="stat-number">{requests.length}</span>
              <span className="stat-label">Richieste Totali</span>
            </div>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Cerca per nome, auto o contatto..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Caricamento richieste...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="empty-state">
            <p>📭 {filter ? 'Nessun risultato trovato' : 'Nessuna richiesta ancora'}</p>
          </div>
        ) : (
          <div className="requests-grid">
            {filteredRequests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="card-header">
                  <h3>{request.firstName} {request.lastName}</h3>
                  <button 
                    onClick={() => handleDelete(request.id)}
                    className="delete-btn"
                    title="Elimina"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="card-body">
                  <div className="info-row">
                    <span className="label">🚗 Auto:</span>
                    <span className="value">{request.carDescription}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">📞 Contatto:</span>
                    <span className="value">
                      <a href={request.contact.includes('@') ? `mailto:${request.contact}` : `tel:${request.contact}`}>
                        {request.contact}
                      </a>
                    </span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">📅 Data:</span>
                    <span className="value timestamp">{formatDate(request.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
