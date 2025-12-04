import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import './Files.css';

function Files() {
  const [sessions, setSessions] = useState([]);
  const [files, setFiles] = useState([]);
  const [cars, setCars] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [newSessionName, setNewSessionName] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newCar, setNewCar] = useState({ licensePlate: '', description: '' });
  const [editingCarId, setEditingCarId] = useState(null);
  const [editingCarData, setEditingCarData] = useState({ licensePlate: '', description: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    fetchSessions();
    fetchAllData();
  }, [navigate]);

  useEffect(() => {
    if (selectedSession) {
      fetchFiles(selectedSession);
    }
  }, [selectedSession]);

  useEffect(() => {
    if (selectedFile) {
      fetchCars(selectedFile);
    }
  }, [selectedFile]);

  const fetchAllData = async () => {
    try {
      // Carica tutti i file
      const filesQuery = query(collection(db, 'files'));
      const filesSnapshot = await getDocs(filesQuery);
      const filesData = filesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllFiles(filesData);

      // Carica tutte le auto
      const carsQuery = query(collection(db, 'cars'));
      const carsSnapshot = await getDocs(carsQuery);
      const carsData = carsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllCars(carsData);
    } catch (error) {
      console.error('Errore caricamento dati completi:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'sessions'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSessions(data);
    } catch (error) {
      console.error('Errore caricamento sessioni:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async (sessionId) => {
    try {
      const q = query(collection(db, 'files'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(file => file.sessionId === sessionId);
      setFiles(data);
    } catch (error) {
      console.error('Errore caricamento files:', error);
    }
  };

  const fetchCars = async (fileId) => {
    try {
      const q = query(collection(db, 'cars'), orderBy('createdAt', 'asc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(car => car.fileId === fileId);
      setCars(data);
    } catch (error) {
      console.error('Errore caricamento auto:', error);
    }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    if (!newSessionName.trim()) return;

    try {
      const docRef = await addDoc(collection(db, 'sessions'), {
        name: newSessionName.trim(),
        createdAt: new Date()
      });

      setSessions([{ id: docRef.id, name: newSessionName.trim() }, ...sessions]);
      setNewSessionName('');
    } catch (error) {
      console.error('Errore aggiunta sessione:', error);
      alert('Errore durante l\'aggiunta della sessione');
    }
  };

  const handleAddFile = async (e) => {
    e.preventDefault();
    if (!selectedSession || !newFileName.trim()) return;

    try {
      const docRef = await addDoc(collection(db, 'files'), {
        name: newFileName.trim(),
        sessionId: selectedSession,
        createdAt: new Date()
      });

      setFiles([{ id: docRef.id, name: newFileName.trim(), sessionId: selectedSession }, ...files]);
      setNewFileName('');
    } catch (error) {
      console.error('Errore aggiunta file:', error);
      alert('Errore durante l\'aggiunta del file');
    }
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    if (!selectedFile || !newCar.licensePlate.trim() || !newCar.description.trim()) return;

    try {
      const docRef = await addDoc(collection(db, 'cars'), {
        licensePlate: newCar.licensePlate.trim(),
        description: newCar.description.trim(),
        fileId: selectedFile,
        createdAt: new Date()
      });

      setCars([...cars, { 
        id: docRef.id, 
        licensePlate: newCar.licensePlate.trim(), 
        description: newCar.description.trim(),
        fileId: selectedFile 
      }]);
      setNewCar({ licensePlate: '', description: '' });
    } catch (error) {
      console.error('Errore aggiunta auto:', error);
      alert('Errore durante l\'aggiunta dell\'auto');
    }
  };

  const handleDeleteSession = async (id) => {
    if (window.confirm('Sei sicuro? Verranno eliminati anche tutti i file e le auto associate.')) {
      try {
        await deleteDoc(doc(db, 'sessions', id));
        setSessions(sessions.filter(s => s.id !== id));
        if (selectedSession === id) {
          setSelectedSession('');
          setFiles([]);
          setSelectedFile('');
          setCars([]);
        }
      } catch (error) {
        console.error('Errore eliminazione sessione:', error);
        alert('Errore durante l\'eliminazione');
      }
    }
  };

  const handleDeleteFile = async (id) => {
    if (window.confirm('Sei sicuro? Verranno eliminate anche tutte le auto associate.')) {
      try {
        await deleteDoc(doc(db, 'files', id));
        setFiles(files.filter(f => f.id !== id));
        if (selectedFile === id) {
          setSelectedFile('');
          setCars([]);
        }
      } catch (error) {
        console.error('Errore eliminazione file:', error);
        alert('Errore durante l\'eliminazione');
      }
    }
  };

  const handleDeleteCar = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa auto?')) {
      try {
        await deleteDoc(doc(db, 'cars', id));
        setCars(cars.filter(c => c.id !== id));
      } catch (error) {
        console.error('Errore eliminazione auto:', error);
        alert('Errore durante l\'eliminazione');
      }
    }
  };

  const handleStartEditCar = (car) => {
    setEditingCarId(car.id);
    setEditingCarData({ licensePlate: car.licensePlate, description: car.description });
  };

  const handleCancelEditCar = () => {
    setEditingCarId(null);
    setEditingCarData({ licensePlate: '', description: '' });
  };

  const handleSaveEditCar = async (id) => {
    if (!editingCarData.licensePlate.trim() || !editingCarData.description.trim()) {
      alert('Compila tutti i campi');
      return;
    }

    try {
      await updateDoc(doc(db, 'cars', id), {
        licensePlate: editingCarData.licensePlate.trim(),
        description: editingCarData.description.trim()
      });

      setCars(cars.map(car =>
        car.id === id ? { ...car, ...editingCarData } : car
      ));

      setEditingCarId(null);
      setEditingCarData({ licensePlate: '', description: '' });
    } catch (error) {
      console.error('Errore aggiornamento auto:', error);
      alert('Errore durante l\'aggiornamento');
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = allCars
      .filter(car => 
        car.licensePlate.toLowerCase().includes(query) ||
        car.description.toLowerCase().includes(query)
      )
      .map(car => {
        const file = allFiles.find(f => f.id === car.fileId);
        const session = sessions.find(s => s.id === file?.sessionId);
        return {
          car,
          file,
          session
        };
      })
      .filter(result => result.file && result.session);

    setSearchResults(results);
    setShowSearch(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/login');
  };

  return (
    <div className="files-container">
      <header className="files-header">
        <div className="header-content">
          <div>
            <h1>📁 Gestione File e Auto</h1>
            <p>Busalla Motor Day × Flylens - Organizzazione Sessioni Video</p>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate('/admin')} className="back-btn">
              ← Dashboard
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="files-content">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="🔍 Cerca auto per targa o descrizione..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-btn">
              Cerca
            </button>
            {showSearch && (
              <button onClick={handleClearSearch} className="clear-search-btn">
                ✕ Chiudi
              </button>
            )}
          </div>

          {showSearch && (
            <div className="search-results">
              <h3>Risultati della ricerca ({searchResults.length})</h3>
              {searchResults.length === 0 ? (
                <div className="no-results">Nessuna auto trovata per "{searchQuery}"</div>
              ) : (
                <div className="results-list">
                  {searchResults.map((result, index) => (
                    <div key={index} className="result-item">
                      <div className="result-car">
                        <div className="result-plate">{result.car.licensePlate}</div>
                        <div className="result-desc">{result.car.description}</div>
                      </div>
                      <div className="result-path">
                        <span className="path-item session-path">
                          🎬 {result.session.name}
                        </span>
                        <span className="path-separator">→</span>
                        <span className="path-item file-path">
                          📄 {result.file.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Caricamento...</p>
          </div>
        ) : (
          <div className="files-layout">
            {/* Colonna Sessioni */}
            <div className="column session-column">
              <div className="column-header">
                <h2>🎬 Sessioni</h2>
                <span className="count">{sessions.length}</span>
              </div>
              
              <form onSubmit={handleAddSession} className="add-form">
                <input
                  type="text"
                  placeholder="Nome sessione..."
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                  className="add-input"
                />
                <button type="submit" className="add-btn">+ Aggiungi</button>
              </form>

              <div className="items-list">
                {sessions.map(session => (
                  <div
                    key={session.id}
                    className={`item ${selectedSession === session.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedSession(session.id);
                      setSelectedFile('');
                      setCars([]);
                    }}
                  >
                    <span className="item-name">{session.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                      className="delete-icon-btn"
                      title="Elimina"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <div className="empty-message">Nessuna sessione</div>
                )}
              </div>
            </div>

            {/* Colonna Files */}
            <div className="column file-column">
              <div className="column-header">
                <h2>📄 File</h2>
                <span className="count">{files.length}</span>
              </div>
              
              {selectedSession ? (
                <>
                  <form onSubmit={handleAddFile} className="add-form">
                    <input
                      type="text"
                      placeholder="Nome file..."
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      className="add-input"
                    />
                    <button type="submit" className="add-btn">+ Aggiungi</button>
                  </form>

                  <div className="items-list">
                    {files.map(file => (
                      <div
                        key={file.id}
                        className={`item ${selectedFile === file.id ? 'selected' : ''}`}
                        onClick={() => setSelectedFile(file.id)}
                      >
                        <span className="item-name">{file.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFile(file.id);
                          }}
                          className="delete-icon-btn"
                          title="Elimina"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                    {files.length === 0 && (
                      <div className="empty-message">Nessun file</div>
                    )}
                  </div>
                </>
              ) : (
                <div className="empty-state">Seleziona una sessione</div>
              )}
            </div>

            {/* Colonna Auto */}
            <div className="column car-column">
              <div className="column-header">
                <h2>🚗 Automobili</h2>
                <span className="count">{cars.length}</span>
              </div>
              
              {selectedFile ? (
                <>
                  <form onSubmit={handleAddCar} className="add-form car-form">
                    <input
                      type="text"
                      placeholder="Targa..."
                      value={newCar.licensePlate}
                      onChange={(e) => setNewCar({ ...newCar, licensePlate: e.target.value })}
                      className="add-input"
                    />
                    <input
                      type="text"
                      placeholder="Descrizione..."
                      value={newCar.description}
                      onChange={(e) => setNewCar({ ...newCar, description: e.target.value })}
                      className="add-input"
                    />
                    <button type="submit" className="add-btn">+ Aggiungi</button>
                  </form>

                  <div className="items-list cars-list">
                    {cars.map(car => (
                      <div key={car.id} className="car-item">
                        {editingCarId === car.id ? (
                          <div className="car-edit-form">
                            <input
                              type="text"
                              value={editingCarData.licensePlate}
                              onChange={(e) => setEditingCarData({ ...editingCarData, licensePlate: e.target.value })}
                              className="edit-input"
                              placeholder="Targa"
                            />
                            <input
                              type="text"
                              value={editingCarData.description}
                              onChange={(e) => setEditingCarData({ ...editingCarData, description: e.target.value })}
                              className="edit-input"
                              placeholder="Descrizione"
                            />
                            <div className="car-actions">
                              <button onClick={() => handleSaveEditCar(car.id)} className="save-btn">✓</button>
                              <button onClick={handleCancelEditCar} className="cancel-btn">✕</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="car-info">
                              <div className="car-plate">{car.licensePlate}</div>
                              <div className="car-desc">{car.description}</div>
                            </div>
                            <div className="car-actions">
                              <button onClick={() => handleStartEditCar(car)} className="edit-btn">✏️</button>
                              <button onClick={() => handleDeleteCar(car.id)} className="delete-btn">🗑️</button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    {cars.length === 0 && (
                      <div className="empty-message">Nessuna auto</div>
                    )}
                  </div>
                </>
              ) : (
                <div className="empty-state">Seleziona un file</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Files;
