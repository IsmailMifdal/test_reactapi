import { render, screen, fireEvent, act } from '@testing-library/react';
import LoginForm from './LoginForm';

// Mock react-router-dom — useNavigate ne peut pas fonctionner sans BrowserRouter dans les tests
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock loginUser pour éviter les vraies requêtes HTTP
jest.mock('./api', () => ({
  loginUser:  jest.fn(),
  countUsers: jest.fn().mockResolvedValue(0),
  getUsers:   jest.fn().mockResolvedValue([]),
  createUser: jest.fn().mockResolvedValue({}),
  deleteUser: jest.fn().mockResolvedValue({}),
}));

import { loginUser } from './api';

const mockSetCurrentUser = jest.fn();

function renderLoginForm() {
  return render(<LoginForm setCurrentUser={mockSetCurrentUser} />);
}

beforeEach(() => {
  jest.clearAllMocks();
});

test('renders email and password fields', () => {
  renderLoginForm();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
});

test('updates email and password on change', () => {
  renderLoginForm();
  fireEvent.change(screen.getByLabelText(/email/i),    { target: { name: 'email',    value: 'admin@test.fr' } });
  fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { name: 'password', value: 'secret'       } });
  expect(screen.getByLabelText(/email/i)).toHaveValue('admin@test.fr');
  expect(screen.getByLabelText(/mot de passe/i)).toHaveValue('secret');
});

test('calls loginUser and setCurrentUser on successful submit', async () => {
  const fakeUser = { id: 1, nom: 'Admin', is_admin: 1 };
  loginUser.mockResolvedValueOnce({ message: 'Connexion réussie', user: fakeUser });

  renderLoginForm();
  fireEvent.change(screen.getByLabelText(/email/i),    { target: { name: 'email',    value: 'admin@test.fr' } });
  fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { name: 'password', value: 'secret'       } });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));
  });

  expect(loginUser).toHaveBeenCalledWith({ email: 'admin@test.fr', password: 'secret' });
  expect(mockSetCurrentUser).toHaveBeenCalledWith(fakeUser);
  expect(mockNavigate).toHaveBeenCalledWith('/');
});

test('shows error message when login fails', async () => {
  loginUser.mockRejectedValueOnce({
    response: { data: { detail: 'Email ou mot de passe incorrect' } },
  });

  renderLoginForm();
  fireEvent.change(screen.getByLabelText(/email/i),    { target: { name: 'email',    value: 'bad@test.fr' } });
  fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { name: 'password', value: 'wrong'      } });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));
  });

  expect(await screen.findByText(/email ou mot de passe incorrect/i)).toBeInTheDocument();
});

test('shows generic error when no response detail', async () => {
  loginUser.mockRejectedValueOnce(new Error('Network error'));

  renderLoginForm();
  fireEvent.change(screen.getByLabelText(/email/i),    { target: { name: 'email',    value: 'x@x.fr' } });
  fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { name: 'password', value: 'pass' } });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /se connecter/i }));
  });

  expect(await screen.findByText(/erreur de connexion/i)).toBeInTheDocument();
});
