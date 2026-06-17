import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import RegistrationForm from './RegistrationForm';
import { countUsers } from './api';

function Navbar({ showBack }) {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Users Manager</Link>
      {showBack && (
        <Link to="/" className="btn-back">Accueil</Link>
      )}
    </nav>
  );
}

function HomePage() {
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    countUsers()
      .then(setUsersCount)
      .catch(() => {});
  }, []);

  return (
    <>
      <Navbar showBack={false} />
      <div className="page">
        <div className="home-card">
          <h1>Users Manager</h1>
          <p className="stat">
            <strong>{usersCount}</strong> user(s) already registered
          </p>
          <Link to="/register" className="btn-primary">S'inscrire →</Link>
        </div>
      </div>
    </>
  );
}

function RegisterPage() {
  return (
    <>
      <Navbar showBack={true} />
      <div className="page">
        <RegistrationForm />
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
