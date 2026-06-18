import { render, screen } from '@testing-library/react';
import App from './App';

// Mock api.js pour éviter les vraies requêtes HTTP
jest.mock('./api', () => ({
  countUsers: jest.fn().mockResolvedValue(3),
  getUsers: jest.fn().mockResolvedValue([
    { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@test.fr', ville: 'Paris', is_admin: 0 },
  ]),
  deleteUser: jest.fn().mockResolvedValue({}),
  loginUser: jest.fn(),
  createUser: jest.fn(),
}));

test('renders Users Manager title on home page', async () => {
  render(<App />);
  const title = await screen.findAllByText(/users manager/i);
  expect(title.length).toBeGreaterThan(0);
});

test('shows Connexion link in navbar when not logged in', async () => {
  render(<App />);
  const loginLink = await screen.findByText(/connexion/i);
  expect(loginLink).toBeInTheDocument();
});

test('renders register link on home page', async () => {
  render(<App />);
  const registerLink = await screen.findByText(/s'inscrire/i);
  expect(registerLink).toBeInTheDocument();
});