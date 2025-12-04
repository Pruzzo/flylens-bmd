import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import * as XLSX from 'xlsx';
import './Admin.css';

function Admin() {
  const [requests, setRequests] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [priceValue, setPriceValue] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' o 'table'
  const [hideDuplicate, setHideDuplicate] = useState(false);
  const [hideUnavailable, setHideUnavailable] = useState(false);
  const [hideAvailable, setHideAvailable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se l'utente è loggato
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    fetchRequests();
    fetchOperators();
  }, [navigate]);

  const fetchOperators = async () => {
    try {
      const q = query(collection(db, 'operators'), orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOperators(data);
    } catch (error) {
      console.error('Errore nel caricamento operatori:', error);
    }
  };

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

  const handleToggleFlag = async (id, flagName) => {
    try {
      const requestDoc = requests.find(req => req.id === id);
      const newValue = !requestDoc[flagName];
      
      await updateDoc(doc(db, 'requests', id), {
        [flagName]: newValue
      });

      setRequests(requests.map(req => 
        req.id === id ? { ...req, [flagName]: newValue } : req
      ));
    } catch (error) {
      console.error('Errore aggiornamento flag:', error);
      alert('Errore durante l\'aggiornamento');
    }
  };

  const handleAssignOperator = async (requestId, operatorId, operatorName) => {
    try {
      await updateDoc(doc(db, 'requests', requestId), {
        assignedOperatorId: operatorId,
        assignedOperatorName: operatorName
      });

      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, assignedOperatorId: operatorId, assignedOperatorName: operatorName } : req
      ));
    } catch (error) {
      console.error('Errore assegnazione operatore:', error);
      alert('Errore durante l\'assegnazione');
    }
  };

  const handleStartEditNote = (request) => {
    setEditingNoteId(request.id);
    setNoteText(request.notes || '');
  };

  const handleCancelEditNote = () => {
    setEditingNoteId(null);
    setNoteText('');
  };

  const handleSaveNote = async (requestId) => {
    try {
      await updateDoc(doc(db, 'requests', requestId), {
        notes: noteText.trim()
      });

      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, notes: noteText.trim() } : req
      ));

      setEditingNoteId(null);
      setNoteText('');
    } catch (error) {
      console.error('Errore salvataggio note:', error);
      alert('Errore durante il salvataggio delle note');
    }
  };

  const handleSavePrice = async (requestId) => {
    try {
      const price = parseFloat(priceValue) || 0;
      await updateDoc(doc(db, 'requests', requestId), {
        price: price
      });

      setRequests(requests.map(req => 
        req.id === requestId ? { ...req, price: price } : req
      ));

      setEditingPriceId(null);
      setPriceValue('');
    } catch (error) {
      console.error('Errore salvataggio prezzo:', error);
      alert('Errore durante il salvataggio del prezzo');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/login');
  };

  const handleExportToExcel = () => {
    if (filteredRequests.length === 0) {
      alert('Nessun dato da esportare');
      return;
    }

    // Prepara i dati per l'esportazione
    const exportData = filteredRequests.map(req => ({
      'Nome': req.firstName || '',
      'Cognome': req.lastName || '',
      'Descrizione Auto': req.carDescription || '',
      'Contatto': req.contact || '',
      'Operatore Assegnato': req.assignedOperatorName || 'Non assegnato',
      'Data e Ora': formatDate(req.timestamp),
      'Conferma Inviata': req.confirmationSent ? 'Sì' : 'No',
      'Video Pronto': req.videoReady ? 'Sì' : 'No',
      'Anteprima Inviata': req.previewSent ? 'Sì' : 'No',
      'Video Acquistato': req.videoPurchased ? 'Sì' : 'No',
      'Note': req.notes || ''
    }));

    // Crea il foglio di lavoro
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Imposta la larghezza delle colonne
    const colWidths = [
      { wch: 15 }, // Nome
      { wch: 15 }, // Cognome
      { wch: 30 }, // Descrizione Auto
      { wch: 25 }, // Contatto
      { wch: 20 }, // Operatore Assegnato
      { wch: 18 }, // Data e Ora
      { wch: 16 }, // Conferma Inviata
      { wch: 16 }, // Video Pronto
      { wch: 16 }, // Anteprima Inviata
      { wch: 16 }, // Video Acquistato
      { wch: 40 }  // Note
    ];
    worksheet['!cols'] = colWidths;

    // Crea il workbook e aggiungi il foglio
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Richieste');

    // Genera il nome del file con la data corrente
    const today = new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date()).replace(/\//g, '-');
    
    const filename = `BMD_Flylens_Richieste_${today}.xlsx`;

    // Esporta il file
    XLSX.writeFile(workbook, filename);
  };

  const filteredRequests = requests.filter(req => {
    // Filtro per testo di ricerca
    const matchesSearch = req.firstName?.toLowerCase().includes(filter.toLowerCase()) ||
      req.lastName?.toLowerCase().includes(filter.toLowerCase()) ||
      req.carDescription?.toLowerCase().includes(filter.toLowerCase()) ||
      req.contact?.toLowerCase().includes(filter.toLowerCase());
    
    // Filtri per nascondere duplicati, non disponibili e disponibili
    const shouldShow = (!hideDuplicate || !req.duplicate) && 
                       (!hideUnavailable || !req.videoUnavailable) &&
                       (!hideAvailable || req.duplicate || req.videoUnavailable);
    
    return matchesSearch && shouldShow;
  });

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
          <div className="header-actions">
            <button onClick={() => navigate('/files')} className="files-btn" title="Gestisci File e Auto">
              📁 File
            </button>
            <button onClick={() => navigate('/operators')} className="operators-btn" title="Gestisci Operatori">
              👥 Operatori
            </button>
            <button onClick={handleExportToExcel} className="export-btn" title="Esporta in Excel">
              📥 Esporta Excel
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-controls">
          <div className="stats">
            <div className="stat-card">
              <span className="stat-number">{requests.length}</span>
              <span className="stat-label">Richieste Totali</span>
            </div>
            
            <div className="stat-card available">
              <span className="stat-number">
                {requests.filter(r => !r.duplicate && !r.videoUnavailable).length}
              </span>
               <span className="stat-label">✅ Richieste Disponibili</span>
            </div>
            
            <div className="stat-card preview-ready">
              <span className="stat-number">{requests.filter(r => r.videoReady).length}</span>
              <span className="stat-label">🎬 Video Pronto</span>
            </div>
            
            <div className="stat-card preview-pending">
              <span className="stat-number">
                {requests.filter(r => r.videoReady && !r.previewSent && !r.duplicate && !r.videoUnavailable).length}
              </span>
              <span className="stat-label">⏳ Anteprima da Inviare</span>
            </div>
            
            <div className="stat-card sold">
              <span className="stat-number">{requests.filter(r => r.videoPurchased).length}</span>
              <span className="stat-label">💰 Video Venduti</span>
            </div>
            
            <div className="stat-card unavailable">
              <span className="stat-number">{requests.filter(r => r.videoUnavailable).length}</span>
              <span className="stat-label">❌ Non Disponibili</span>
            </div>
            
            <div className="stat-card duplicate">
              <span className="stat-number">{requests.filter(r => r.duplicate).length}</span>
              <span className="stat-label">📋 Duplicati</span>
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

          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Vista Card"
            >
              📋 Card
            </button>
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Vista Tabella"
            >
              📊 Tabella
            </button>
          </div>

          <div className="filter-toggles">
            <button 
              className={`filter-toggle-btn available ${hideAvailable ? 'active' : ''}`}
              onClick={() => setHideAvailable(!hideAvailable)}
              title="Nascondi richieste disponibili"
            >
              {hideAvailable ? '🙈' : '👁️'} Disponibili
            </button>
            <button 
              className={`filter-toggle-btn ${hideDuplicate ? 'active' : ''}`}
              onClick={() => setHideDuplicate(!hideDuplicate)}
              title="Nascondi richieste duplicate"
            >
              {hideDuplicate ? '🙈' : '👁️'} Duplicati
            </button>
            <button 
              className={`filter-toggle-btn ${hideUnavailable ? 'active' : ''}`}
              onClick={() => setHideUnavailable(!hideUnavailable)}
              title="Nascondi video non disponibili"
            >
              {hideUnavailable ? '🙈' : '👁️'} Non Disponibili
            </button>
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
        ) : viewMode === 'table' ? (
          <div className="table-view">
            <div className="table-container">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Nome</th>
                    <th>Cognome</th>
                    <th>Auto</th>
                    <th>Contatto</th>
                    <th>Operatore</th>
                    <th>Prezzo</th>
                    <th>Conferma</th>
                    <th>Pronto</th>
                    <th>Anteprima</th>
                    <th>Acquisto</th>
                    <th>Non Disp.</th>
                    <th>Msg N.D.</th>
                    <th>Duplicato</th>
                    <th>Note</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className={`${request.videoUnavailable ? 'unavailable-row' : ''} ${request.duplicate ? 'duplicate-row' : ''}`}>
                      <td className="date-cell">{formatDate(request.timestamp)}</td>
                      <td>{request.firstName}</td>
                      <td>{request.lastName}</td>
                      <td>{request.carDescription}</td>
                      <td>
                        <a href={request.contact.includes('@') ? `mailto:${request.contact}` : `tel:${request.contact}`}>
                          {request.contact}
                        </a>
                      </td>
                      <td>
                        <select 
                          className="table-operator-select"
                          value={request.assignedOperatorId || ''}
                          onChange={(e) => {
                            const selectedOperator = operators.find(op => op.id === e.target.value);
                            if (selectedOperator) {
                              handleAssignOperator(request.id, selectedOperator.id, selectedOperator.name);
                            } else {
                              handleAssignOperator(request.id, null, null);
                            }
                          }}
                        >
                          <option value="">-</option>
                          {operators.map(op => (
                            <option key={op.id} value={op.id}>{op.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="price-cell">
                        {editingPriceId === request.id ? (
                          <div className="price-edit">
                            <input
                              type="number"
                              className="price-input"
                              value={priceValue}
                              onChange={(e) => setPriceValue(e.target.value)}
                              placeholder="€"
                              step="0.01"
                              autoFocus
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleSavePrice(request.id);
                                }
                              }}
                            />
                            <button
                              onClick={() => handleSavePrice(request.id)}
                              className="save-price-btn"
                              title="Salva"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => {
                                setEditingPriceId(null);
                                setPriceValue('');
                              }}
                              className="cancel-price-btn"
                              title="Annulla"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div
                            className="price-display"
                            onClick={() => {
                              setEditingPriceId(request.id);
                              setPriceValue(request.price || '');
                            }}
                            title="Clicca per modificare"
                          >
                            {request.price ? `€${request.price.toFixed(2)}` : '-'}
                          </div>
                        )}
                      </td>
                      <td className="flag-cell">
                        <button 
                          className={`table-flag-btn ${request.confirmationSent ? 'active' : ''}`}
                          onClick={() => handleToggleFlag(request.id, 'confirmationSent')}
                          title="Conferma inviata"
                        >
                          {request.confirmationSent ? '✓' : '○'}
                        </button>
                      </td>
                      <td className="flag-cell">
                        <button 
                          className={`table-flag-btn ${request.videoReady ? 'active' : ''}`}
                          onClick={() => handleToggleFlag(request.id, 'videoReady')}
                          title="Video pronto"
                        >
                          {request.videoReady ? '✓' : '○'}
                        </button>
                      </td>
                      <td className="flag-cell">
                        <button 
                          className={`table-flag-btn ${request.previewSent ? 'active' : ''}`}
                          onClick={() => handleToggleFlag(request.id, 'previewSent')}
                          title="Anteprima inviata"
                        >
                          {request.previewSent ? '✓' : '○'}
                        </button>
                      </td>
                      <td className="flag-cell">
                        <button 
                          className={`table-flag-btn ${request.videoPurchased ? 'active' : ''}`}
                          onClick={() => handleToggleFlag(request.id, 'videoPurchased')}
                          title="Video acquistato"
                        >
                          {request.videoPurchased ? '✓' : '○'}
                        </button>
                      </td>
                      <td className="flag-cell">
                        <button 
                          className={`table-flag-btn ${request.videoUnavailable ? 'active unavailable' : ''}`}
                          onClick={() => handleToggleFlag(request.id, 'videoUnavailable')}
                          title="Video non disponibile"
                        >
                          {request.videoUnavailable ? '✓' : '○'}
                        </button>
                      </td>
                      <td className="flag-cell">
                        {request.videoUnavailable ? (
                          <button 
                            className={`table-flag-btn ${request.unavailableMessageSent ? 'active' : ''}`}
                            onClick={() => handleToggleFlag(request.id, 'unavailableMessageSent')}
                            title="Messaggio non disponibile inviato"
                          >
                            {request.unavailableMessageSent ? '✓' : '○'}
                          </button>
                        ) : (
                          <span className="na-cell">-</span>
                        )}
                      </td>
                      <td className="flag-cell">
                        <button 
                          className={`table-flag-btn ${request.duplicate ? 'active duplicate' : ''}`}
                          onClick={() => handleToggleFlag(request.id, 'duplicate')}
                          title="Duplicato"
                        >
                          {request.duplicate ? '✓' : '○'}
                        </button>
                      </td>
                      <td className="notes-cell">
                        {editingNoteId === request.id ? (
                          <div className="table-notes-edit">
                            <textarea
                              className="table-notes-textarea"
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              rows="2"
                              autoFocus
                            />
                            <div className="table-notes-actions">
                              <button onClick={() => handleSaveNote(request.id)} className="table-save-btn">✓</button>
                              <button onClick={handleCancelEditNote} className="table-cancel-btn">✕</button>
                            </div>
                          </div>
                        ) : (
                          <div className="table-notes-display" onClick={() => handleStartEditNote(request)}>
                            {request.notes ? (
                              <span title={request.notes}>{request.notes.substring(0, 30)}{request.notes.length > 30 ? '...' : ''}</span>
                            ) : (
                              <span className="no-notes-table">-</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="actions-cell">
                        <button 
                          onClick={() => handleDelete(request.id)}
                          className="table-delete-btn"
                          title="Elimina"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="requests-grid">
            {filteredRequests.map((request) => (
              <div key={request.id} className={`request-card ${request.videoUnavailable ? 'unavailable-card' : ''} ${request.duplicate ? 'duplicate-card' : ''}`}>
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
                  
                  <div className="info-row">
                    <span className="label">👤 Operatore:</span>
                    <span className="value">
                      <select 
                        className="operator-select"
                        value={request.assignedOperatorId || ''}
                        onChange={(e) => {
                          const selectedOperator = operators.find(op => op.id === e.target.value);
                          if (selectedOperator) {
                            handleAssignOperator(request.id, selectedOperator.id, selectedOperator.name);
                          } else {
                            handleAssignOperator(request.id, null, null);
                          }
                        }}
                      >
                        <option value="">Non assegnato</option>
                        {operators.map(op => (
                          <option key={op.id} value={op.id}>{op.name}</option>
                        ))}
                      </select>
                    </span>
                  </div>
                  
                  <div className="info-row">
                    <span className="label">💰 Prezzo:</span>
                    <span className="value">
                      {editingPriceId === request.id ? (
                        <div className="price-edit-card">
                          <input
                            type="number"
                            className="price-input-card"
                            value={priceValue}
                            onChange={(e) => setPriceValue(e.target.value)}
                            placeholder="Inserisci prezzo"
                            step="0.01"
                            autoFocus
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSavePrice(request.id);
                              }
                            }}
                          />
                          <div className="price-actions">
                            <button
                              onClick={() => handleSavePrice(request.id)}
                              className="save-price-btn-card"
                              title="Salva"
                            >
                              ✓ Salva
                            </button>
                            <button
                              onClick={() => {
                                setEditingPriceId(null);
                                setPriceValue('');
                              }}
                              className="cancel-price-btn-card"
                              title="Annulla"
                            >
                              ✕ Annulla
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span
                          className="price-display-card"
                          onClick={() => {
                            setEditingPriceId(request.id);
                            setPriceValue(request.price || '');
                          }}
                          title="Clicca per modificare"
                        >
                          {request.price ? `€${request.price.toFixed(2)}` : 'Non impostato - Clicca per impostare'}
                        </span>
                      )}
                    </span>
                  </div>
                  
                  <div className="flags-section">
                    <button 
                      className={`flag-btn ${request.confirmationSent ? 'active' : ''}`}
                      onClick={() => handleToggleFlag(request.id, 'confirmationSent')}
                      title="Messaggio conferma ricezione richiesta"
                    >
                      ✉️ Conferma inviata
                    </button>
                    
                    <button 
                      className={`flag-btn ${request.videoReady ? 'active' : ''}`}
                      onClick={() => handleToggleFlag(request.id, 'videoReady')}
                      title="Video completato e pronto"
                    >
                      🎥 Video pronto
                    </button>
                    
                    <button 
                      className={`flag-btn ${request.previewSent ? 'active' : ''}`}
                      onClick={() => handleToggleFlag(request.id, 'previewSent')}
                      title="Anteprima inviata al cliente"
                    >
                      🎬 Anteprima inviata
                    </button>
                    
                    <button 
                      className={`flag-btn ${request.videoPurchased ? 'active' : ''}`}
                      onClick={() => handleToggleFlag(request.id, 'videoPurchased')}
                      title="Video acquistato dal cliente"
                    >
                      💰 Video acquistato
                    </button>
                    
                    <button 
                      className={`flag-btn ${request.videoUnavailable ? 'active unavailable' : ''}`}
                      onClick={() => handleToggleFlag(request.id, 'videoUnavailable')}
                      title="Video non disponibile"
                    >
                      ❌ Video non disponibile
                    </button>
                    
                    {request.videoUnavailable && (
                      <button 
                        className={`flag-btn ${request.unavailableMessageSent ? 'active' : ''}`}
                        onClick={() => handleToggleFlag(request.id, 'unavailableMessageSent')}
                        title="Messaggio 'video non disponibile' inviato al cliente"
                      >
                        📧 Msg non disp. inviato
                      </button>
                    )}
                    
                    <button 
                      className={`flag-btn ${request.duplicate ? 'active duplicate' : ''}`}
                      onClick={() => handleToggleFlag(request.id, 'duplicate')}
                      title="Duplicato"
                    >
                      📋 Duplicato
                    </button>
                  </div>

                  <div className="notes-section">
                    <div className="notes-header">
                      <span className="notes-label">📝 Note:</span>
                      {editingNoteId === request.id ? (
                        <div className="notes-actions">
                          <button 
                            onClick={() => handleSaveNote(request.id)}
                            className="save-note-btn"
                            title="Salva note"
                          >
                            ✓ Salva
                          </button>
                          <button 
                            onClick={handleCancelEditNote}
                            className="cancel-note-btn"
                            title="Annulla"
                          >
                            ✕ Annulla
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleStartEditNote(request)}
                          className="edit-note-btn"
                          title="Modifica note"
                        >
                          ✏️ {request.notes ? 'Modifica' : 'Aggiungi'}
                        </button>
                      )}
                    </div>
                    
                    {editingNoteId === request.id ? (
                      <textarea
                        className="notes-textarea"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Inserisci note per questa richiesta..."
                        rows="4"
                        autoFocus
                      />
                    ) : (
                      <div className="notes-display">
                        {request.notes || <span className="no-notes">Nessuna nota</span>}
                      </div>
                    )}
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
