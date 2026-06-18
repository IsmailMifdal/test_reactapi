import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import * as api from './api';

const mockUser  = { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@test.fr', ville: 'Paris', is_admin: 0 };
const mockAdmin = { id: 2, nom: 'Admin',  prenom: 'Admin', email: 'admin@test.fr', ville: 'City', is_admin: 1 };

// Helper : connecte l'app en tant qu'admin
async function loginAsAdmin() {
  fireEvent.click(screen.getByText(/connexion/i));
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/email/i),        { target: { name: 'email',    value: 'admin@test.fr' } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { name: 'password', value: 'secret'       } });
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));
  });
  await waitFor(() => expect(screen.getByText(/déconnexion/i)).toBeInTheDocument());
}

beforeEach(() => {
  jest.spyOn(api, 'countUsers').mockResolvedValue(1);
  jest.spyOn(api, 'getUsers').mockResolvedValue([mockUser]);
  jest.spyOn(api, 'deleteUser').mockResolvedValue({});
  jest.spyOn(api, 'loginUser').mockResolvedValue({ message: 'ok', user: mockAdmin });
  jest.spyOn(api, 'createUser').mockResolvedValue({});
  window.confirm = jest.fn().mockReturnValue(true);
  window.alert   = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

import App from './App';

// ── Page d'accueil (non connecté) ───────────────────────────────────────────

test('renders Users Manager title on home page', async () => {
  await act(async () => { render(<App />); });
  expect(screen.getAllByText(/users manager/i).length).toBeGreaterThan(0);
});

test('shows Connexion link in navbar when not logged in', async () => {
  await act(async () => { render(<App />); });
  expect(screen.getByText(/connexion/i)).toBeInTheDocument();
});

test('renders register link on home page', async () => {
  await act(async () => { render(<App />); });
  expect(screen.getAllByText(/s'inscrire/i).length).toBeGreaterThan(0);
});

test('shows user count from API', async () => {
  await act(async () => { render(<App />); });
  await waitFor(() => expect(screen.getByText(/user\(s\) already registered/i)).toBeInTheDocument());
});

test('shows user table when users are returned', async () => {
  await act(async () => { render(<App />); });
  await waitFor(() => expect(screen.getByText('Dupont')).toBeInTheDocument());
});

test('does not show delete button for non-admin user', async () => {
  jest.spyOn(api, 'loginUser').mockResolvedValue({ message: 'ok', user: mockUser }); // user normal
  await act(async () => { render(<App />); });
  await waitFor(() => expect(screen.getByText('Dupont')).toBeInTheDocument());
  expect(screen.queryByTitle(/supprimer/i)).not.toBeInTheDocument();
});

// ── Navigation ──────────────────────────────────────────────────────────────

test('navigates to register page', async () => {
  await act(async () => { render(<App />); });
  await waitFor(() => expect(screen.getAllByText(/s'inscrire/i).length).toBeGreaterThan(0));
  fireEvent.click(screen.getByText(/s'inscrire →/i));
  await waitFor(() => expect(screen.getByText(/formulaire d'inscription/i)).toBeInTheDocument());
});

// ── Panel admin ─────────────────────────────────────────────────────────────

test('admin sees delete and eye buttons in user table', async () => {
  await act(async () => { render(<App />); });
  await loginAsAdmin();
  await waitFor(() => expect(screen.getByTitle(/supprimer/i)).toBeInTheDocument());
  expect(screen.getByTitle(/voir les détails/i)).toBeInTheDocument();
});

test('handleDelete calls deleteUser on confirm', async () => {
  const deleteSpy = jest.spyOn(api, 'deleteUser').mockResolvedValue({});
  await act(async () => { render(<App />); });
  await loginAsAdmin();
  await waitFor(() => expect(screen.getByTitle(/supprimer/i)).toBeInTheDocument());
  await act(async () => { fireEvent.click(screen.getByTitle(/supprimer/i)); });
  expect(window.confirm).toHaveBeenCalled();
  expect(deleteSpy).toHaveBeenCalledWith(mockUser.id);
});

test('handleDelete does nothing when confirm is cancelled', async () => {
  window.confirm = jest.fn().mockReturnValue(false);
  const deleteSpy = jest.spyOn(api, 'deleteUser').mockResolvedValue({});
  await act(async () => { render(<App />); });
  await loginAsAdmin();
  await waitFor(() => expect(screen.getByTitle(/supprimer/i)).toBeInTheDocument());
  await act(async () => { fireEvent.click(screen.getByTitle(/supprimer/i)); });
  expect(window.confirm).toHaveBeenCalled();
  expect(deleteSpy).not.toHaveBeenCalled();
});

test('handleDelete shows alert when deleteUser fails', async () => {
  jest.spyOn(api, 'deleteUser').mockRejectedValue(new Error('Network error'));
  await act(async () => { render(<App />); });
  await loginAsAdmin();
  await waitFor(() => expect(screen.getByTitle(/supprimer/i)).toBeInTheDocument());
  await act(async () => { fireEvent.click(screen.getByTitle(/supprimer/i)); });
  expect(window.alert).toHaveBeenCalledWith('Erreur lors de la suppression');
});

test('admin can open and close user details modal', async () => {
  await act(async () => { render(<App />); });
  await loginAsAdmin();
  await waitFor(() => expect(screen.getByTitle(/voir les détails/i)).toBeInTheDocument());
  await act(async () => { fireEvent.click(screen.getByTitle(/voir les détails/i)); });
  expect(screen.getByText(/Détails de l'utilisateur/i)).toBeInTheDocument();
  // l'email apparaît dans la table ET dans le modal
  expect(screen.getAllByText('jean@test.fr').length).toBeGreaterThanOrEqual(2);
  // Ferme le modal — couvre setSelectedUser(null)
  fireEvent.click(screen.getByRole('button', { name: /fermer/i }));
  expect(screen.queryByText(/Détails de l'utilisateur/i)).not.toBeInTheDocument();
});

// ── handleLogout ─────────────────────────────────────────────────────────────

test('handleLogout resets user and shows Connexion link', async () => {
  await act(async () => { render(<App />); });
  await loginAsAdmin();
  await act(async () => { fireEvent.click(screen.getByText(/déconnexion/i)); });
  expect(screen.getByText(/connexion/i)).toBeInTheDocument();
});