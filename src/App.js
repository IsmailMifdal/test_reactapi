import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import { countUsers, getUsers, deleteUser } from './api';

function Navbar({ showBack, currentUser, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Users Manager</Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {currentUser ? (
          <>
            <span style={{ color: 'white', fontSize: '0.9rem' }}>Connecté: {currentUser.nom}</span>
            <button onClick={onLogout} className="btn-back">Déconnexion</button>
          </>
        ) : (
          <Link to="/login" className="btn-back">Connexion</Link>
        )}
        {showBack && (
          <Link to="/" className="btn-back">Accueil</Link>
        )}
      </div>
    </nav>
  );
}

function HomePage({ currentUser, onLogout }) {
  const [usersCount, setUsersCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchData = () => {
    countUsers().then(setUsersCount).catch(() => {});
    getUsers().then(setUsers).catch(() => {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      try {
        await deleteUser(id);
        fetchData(); // Refresh list
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  return (
    <>
      <Navbar showBack={false} currentUser={currentUser} onLogout={onLogout} />
      <div className="page">
        <div className="home-card list-card">
          <h1>Users Manager</h1>
          <p className="stat">
            <strong>{usersCount}</strong> user(s) already registered
          </p>
          <Link to="/register" className="btn-primary">S'inscrire →</Link>

          {users.length > 0 && (
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Ville</th>
                    {currentUser?.is_admin === 1 && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.nom}</td>
                      <td>{user.prenom}</td>
                      <td>{user.email}</td>
                      <td>{user.ville}</td>
                      {currentUser?.is_admin === 1 && (
                        <td>
                          <button onClick={() => setSelectedUser(user)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#61dafb', padding: '4px' }} title="Voir les détails">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(user.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d', padding: '4px', marginLeft: '0.5rem' }} title="Supprimer">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedUser && (
            <div className="toast" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', border: '1px solid #ccc', padding: '2rem', animation: 'none' }}>
              <h3>Détails de l'utilisateur</h3>
              <p><strong>Nom:</strong> {selectedUser.nom}</p>
              <p><strong>Prénom:</strong> {selectedUser.prenom}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Date de naissance:</strong> {selectedUser.dateNaissance}</p>
              <p><strong>Ville:</strong> {selectedUser.ville}</p>
              <p><strong>Code Postal:</strong> {selectedUser.codePostal}</p>
              <p><strong>Mot de passe:</strong> {selectedUser.password}</p>
              <button onClick={() => setSelectedUser(null)} className="btn-primary" style={{ marginTop: '1rem' }}>Fermer</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function RegisterPage({ currentUser, onLogout }) {
  return (
    <>
      <Navbar showBack={true} currentUser={currentUser} onLogout={onLogout} />
      <div className="page">
        <RegistrationForm />
      </div>
    </>
  );
}

function LoginPage({ setCurrentUser }) {
  return (
    <>
      <Navbar showBack={true} />
      <div className="page">
        <LoginForm setCurrentUser={setCurrentUser} />
      </div>
    </>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/register" element={<RegisterPage currentUser={currentUser} onLogout={handleLogout} />} />
        <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
