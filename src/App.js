import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import RegistrationForm from './RegistrationForm';

function App() {
  const [count, setCount] = useState(0);

  const clickOnMe = () => {
    setCount(count + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={clickOnMe}>Click me</button>
        <span data-testid="count">{count}</span>
      </header>
      <main className="App-main">
        <RegistrationForm />
      </main>
    </div>
  );
}

export default App;
