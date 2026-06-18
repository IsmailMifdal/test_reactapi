import { render, screen, fireEvent, act } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';

// Mock createUser — l'inscription passe par l'API, pas le localStorage
jest.mock('./api', () => ({
  createUser: jest.fn().mockResolvedValue({ message: 'Utilisateur créé', id: 1 }),
  countUsers: jest.fn().mockResolvedValue(0),
  getUsers:   jest.fn().mockResolvedValue([]),
  loginUser:  jest.fn().mockResolvedValue({}),
  deleteUser: jest.fn().mockResolvedValue({}),
}));

// Le champ password est requis pour que le formulaire soit valide
function fillValidForm() {
  fireEvent.change(screen.getByLabelText('Nom'),               { target: { name: 'nom',           value: 'Tepixtle'                } });
  fireEvent.change(screen.getByLabelText('Prénom'),            { target: { name: 'prenom',        value: 'Julio'                   } });
  fireEvent.change(screen.getByLabelText('Adresse e-mail'),    { target: { name: 'email',         value: 'Julio.Tepixtle@gmail.com' } });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { name: 'dateNaissance', value: '1990-01-01'              } });
  fireEvent.change(screen.getByLabelText('Ville'),             { target: { name: 'ville',         value: 'Paris'                   } });
  fireEvent.change(screen.getByLabelText('Code postal'),       { target: { name: 'codePostal',    value: '75001'                  } });
  fireEvent.change(screen.getByLabelText('Mot de passe'),      { target: { name: 'password',      value: 'motdepasse123'           } });
}

const submitBtn = () => screen.getByRole('button', { name: /s'inscrire/i });

// ── Validation du bouton submit ─────────────────────────────────────────────

test('submit button is disabled when the form is empty', () => {
  render(<RegistrationForm />);
  expect(submitBtn()).toBeDisabled();
});

test('submit button is enabled when all fields are valid', () => {
  render(<RegistrationForm />);
  fillValidForm();
  expect(submitBtn()).not.toBeDisabled();
});

test('submit button stays disabled when only some fields are filled', () => {
  render(<RegistrationForm />);
  fireEvent.change(screen.getByLabelText('Nom'), { target: { name: 'nom', value: 'Tepixtle' } });
  expect(submitBtn()).toBeDisabled();
});

test('submit button becomes disabled again if a valid field is cleared', () => {
  render(<RegistrationForm />);
  fillValidForm();
  fireEvent.change(screen.getByLabelText('Nom'), { target: { name: 'nom', value: '' } });
  expect(submitBtn()).toBeDisabled();
});

// ── Messages d'erreur de validation ────────────────────────────────────────

test('shows a red error when nom contains digits after blur', () => {
  render(<RegistrationForm />);
  const input = screen.getByLabelText('Nom');
  fireEvent.change(input, { target: { name: 'nom', value: 'Tepixtle1' } });
  fireEvent.blur(input);
  const err = screen.getByText(/nom invalide/i);
  expect(err).toBeInTheDocument();
  expect(err).toHaveClass('form-error');
});

test('shows a red error when email is malformed after blur', () => {
  render(<RegistrationForm />);
  const input = screen.getByLabelText('Adresse e-mail');
  fireEvent.change(input, { target: { name: 'email', value: 'not-an-email' } });
  fireEvent.blur(input);
  const err = screen.getByText(/e-mail invalide/i);
  expect(err).toBeInTheDocument();
  expect(err).toHaveClass('form-error');
});

test('shows a red error when code postal is not 5 digits after blur', () => {
  render(<RegistrationForm />);
  const input = screen.getByLabelText('Code postal');
  fireEvent.change(input, { target: { name: 'codePostal', value: '1234' } });
  fireEvent.blur(input);
  const err = screen.getByText(/code postal invalide/i);
  expect(err).toBeInTheDocument();
  expect(err).toHaveClass('form-error');
});

test('shows a red error when the person is under 18 after blur', () => {
  render(<RegistrationForm />);
  const input = screen.getByLabelText('Date de naissance');
  fireEvent.change(input, { target: { name: 'dateNaissance', value: '2015-01-01' } });
  fireEvent.blur(input);
  const err = screen.getByText(/18 ans/i);
  expect(err).toBeInTheDocument();
  expect(err).toHaveClass('form-error');
});

test('shows a red error when prenom contains special characters after blur', () => {
  render(<RegistrationForm />);
  const input = screen.getByLabelText('Prénom');
  fireEvent.change(input, { target: { name: 'prenom', value: 'Julio2' } });
  fireEvent.blur(input);
  const err = screen.getByText(/prénom invalide/i);
  expect(err).toBeInTheDocument();
  expect(err).toHaveClass('form-error');
});

test('shows a red error when ville contains digits after blur', () => {
  render(<RegistrationForm />);
  const input = screen.getByLabelText('Ville');
  fireEvent.change(input, { target: { name: 'ville', value: 'Paris75' } });
  fireEvent.blur(input);
  const err = screen.getByText(/ville invalide/i);
  expect(err).toBeInTheDocument();
  expect(err).toHaveClass('form-error');
});

test('does not show errors before the user touches any field', () => {
  render(<RegistrationForm />);
  expect(screen.queryByText(/nom invalide/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/e-mail invalide/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/code postal invalide/i)).not.toBeInTheDocument();
});

// ── Soumission du formulaire (async, via API) ───────────────────────────────

test('displays a success toast after a valid submit', async () => {
  render(<RegistrationForm />);
  fillValidForm();
  await act(async () => { fireEvent.click(submitBtn()); });
  const alert = await screen.findByRole('alert');
  expect(alert).toBeInTheDocument();
  expect(alert).toHaveClass('toast-success');
});

test('clears all fields after a valid submit', async () => {
  render(<RegistrationForm />);
  fillValidForm();
  await act(async () => { fireEvent.click(submitBtn()); });
  expect(screen.getByLabelText('Nom')).toHaveValue('');
  expect(screen.getByLabelText('Prénom')).toHaveValue('');
  expect(screen.getByLabelText('Adresse e-mail')).toHaveValue('');
  expect(screen.getByLabelText('Ville')).toHaveValue('');
  expect(screen.getByLabelText('Code postal')).toHaveValue('');
});

test('submit button is disabled again after a successful submit', async () => {
  render(<RegistrationForm />);
  fillValidForm();
  await act(async () => { fireEvent.click(submitBtn()); });
  expect(submitBtn()).toBeDisabled();
});

test('handleSubmit guard: submitting an invalid form does nothing', () => {
  render(<RegistrationForm />);
  fireEvent.submit(screen.getByRole('form', { name: /inscription/i }));
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('shows an error toast when createUser fails', async () => {
  const { createUser } = require('./api');
  createUser.mockRejectedValueOnce(new Error('Serveur indisponible'));
  render(<RegistrationForm />);
  fillValidForm();
  await act(async () => { fireEvent.click(submitBtn()); });
  const alert = await screen.findByRole('alert');
  expect(alert).toHaveTextContent(/Serveur indisponible/i);
});

test('useEffect cleanup: toast disappears after 4 seconds', async () => {
  jest.useFakeTimers();
  render(<RegistrationForm />);
  fillValidForm();
  await act(async () => { fireEvent.click(submitBtn()); });
  expect(await screen.findByRole('alert')).toBeInTheDocument();
  act(() => { jest.advanceTimersByTime(4001); });
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  jest.useRealTimers();
});
