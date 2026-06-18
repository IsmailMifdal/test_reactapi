import { render, screen, act } from '@testing-library/react';
import * as api from './api';

// spyOn après l'import — fonctionne indépendamment du moduleNameMapper
beforeEach(() => {
  jest.spyOn(api, 'countUsers').mockResolvedValue(2);
  jest.spyOn(api, 'getUsers').mockResolvedValue([
    { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@test.fr', ville: 'Paris', is_admin: 0 },
  ]);
  jest.spyOn(api, 'deleteUser').mockResolvedValue({});
  jest.spyOn(api, 'loginUser').mockResolvedValue({});
  jest.spyOn(api, 'createUser').mockResolvedValue({});
});

afterEach(() => {
  jest.restoreAllMocks();
});

import App from './App';

test('renders Users Manager title on home page', async () => {
  await act(async () => { render(<App />); });
  const titles = screen.getAllByText(/users manager/i);
  expect(titles.length).toBeGreaterThan(0);
});

test('shows Connexion link in navbar when not logged in', async () => {
  await act(async () => { render(<App />); });
  const loginLink = screen.getByText(/connexion/i);
  expect(loginLink).toBeInTheDocument();
});

test('renders register link on home page', async () => {
  await act(async () => { render(<App />); });
  const registerLinks = screen.getAllByText(/s'inscrire/i);
  expect(registerLinks.length).toBeGreaterThan(0);
});