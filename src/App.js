import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import RegistrationForm from './RegistrationForm';
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0);
  const port = process.env.REACT_APP_SERVER_PORT;
  let [usersCount, setUsersCount] = useState(0);

  const clickOnMe = () => {
    setCount(count + 1);
  };

  useEffect(() => {
    async function countUsers() {
      try {
        const api = axios.create({
          baseURL: `http://localhost:${port}`
        });
        const response = await api.get(`/users`);
        setUsersCount(response.data.utilisateurs.length);
      } catch (error) {
        console.error(error);
      }
    }
    countUsers();
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={clickOnMe}>Click me</button>
        <span data-testid="count">{count}</span>
        <h1>Users manager</h1>
        <p>{usersCount} user(s) already registered</p>
      </header>
      <main className="App-main">
        <RegistrationForm />
      </main>
    </div>
  );
}

export default App;
