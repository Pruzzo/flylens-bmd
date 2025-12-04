import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import './Operators.css';

function Operators() {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOperatorName, setNewOperatorName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    fetchOperators();
  }, [navigate]);

  const fetchOperators = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'operators'), orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOperators(data);
    } catch (error) {
      console.error('Errore nel caricamento operatori:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOperator = async (e) => {
    e.preventDefault();
    if (!newOperatorName.trim()) {
      alert('Inserisci il nome dell\'operatore');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'operators'), {
        name: newOperatorName.trim(),
        createdAt: new Date()
      });

      setOperators([...operators, {
        id: docRef.id,
        name: newOperatorName.trim()
      }].sort((a, b) => a.name.localeCompare(b.name)));

      setNewOperatorName('');
    } catch (error) {
      console.error('Errore aggiunta operatore:', error);
      alert('Errore durante l\'aggiunta dell\'operatore');
    }
  };

  const handleDeleteOperator = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo operatore?')) {
      try {
        await deleteDoc(doc(db, 'operators', id));
        setOperators(operators.filter(op => op.id !== id));
      } catch (error) {
        console.error('Errore eliminazione operatore:', error);
        alert('Errore durante l\'eliminazione');
      }
    }
  };

  const handleStartEdit = (operator) => {
    setEditingId(operator.id);
    setEditingName(operator.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveEdit = async (id) => {
    if (!editingName.trim()) {
      alert('Il nome non può essere vuoto');
      return;
    }

    try {
      await updateDoc(doc(db, 'operators', id), {
        name: editingName.trim()
      });

      setOperators(operators.map(op =>
        op.id === id ? { ...op, name: editingName.trim() } : op
      ).sort((a, b) => a.name.localeCompare(b.name)));

      setEditingId(null);
      setEditingName('');
    } catch (error) {
      console.error('Errore aggiornamento operatore:', error);
      alert('Errore durante l\'aggiornamento');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/login');
  };

  return (
    <div className="operators-container">
      <header className="operators-header">
        <div className="header-content">
          <div>
            <h1>👥 Gestione Operatori</h1>
            <p>Busalla Motor Day × Flylens - Operatori Video</p>
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

      <div className="operators-content">
        <div className="add-operator-section">
          <h2>➕ Aggiungi Nuovo Operatore</h2>
          <form onSubmit={handleAddOperator} className="add-form">
            <input
              type="text"
              placeholder="Nome operatore..."
              value={newOperatorName}
              onChange={(e) => setNewOperatorName(e.target.value)}
              className="operator-input"
            />
            <button type="submit" className="add-btn">
              Aggiungi
            </button>
          </form>
        </div>

        <div className="operators-list-section">
          <h2>📋 Elenco Operatori ({operators.length})</h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Caricamento operatori...</p>
            </div>
          ) : operators.length === 0 ? (
            <div className="empty-state">
              <p>📭 Nessun operatore ancora. Aggiungine uno!</p>
            </div>
          ) : (
            <div className="operators-table">
              <table>
                <thead>
                  <tr>
                    <th>Nome Operatore</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {operators.map((operator) => (
                    <tr key={operator.id}>
                      <td>
                        {editingId === operator.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="edit-input"
                            autoFocus
                          />
                        ) : (
                          <span className="operator-name">{operator.name}</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          {editingId === operator.id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(operator.id)}
                                className="save-btn"
                                title="Salva"
                              >
                                ✓ Salva
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="cancel-btn"
                                title="Annulla"
                              >
                                ✕ Annulla
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEdit(operator)}
                                className="edit-btn"
                                title="Modifica"
                              >
                                ✏️ Modifica
                              </button>
                              <button
                                onClick={() => handleDeleteOperator(operator.id)}
                                className="delete-btn"
                                title="Elimina"
                              >
                                🗑️ Elimina
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Operators;
