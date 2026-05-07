import { render, screen, fireEvent, act } from '@testing-library/react';
import RegistrationForm from './RegistrationForm';

function fillValidForm() {
  fireEvent.change(screen.getByLabelText('Nom'),               { target: { name: 'nom',           value: 'Tepixtle'               } });
  fireEvent.change(screen.getByLabelText('Prénom'),            { target: { name: 'prenom',        value: 'Julio'                 } });
  fireEvent.change(screen.getByLabelText('Adresse e-mail'),    { target: { name: 'email',         value: 'Julio.Tepixtle@gmail.com'} });
  fireEvent.change(screen.getByLabelText('Date de naissance'), { target: { name: 'dateNaissance', value: '1990-01-01'           } });
  fireEvent.change(screen.getByLabelText('Ville'),             { target: { name: 'ville',         value: 'Paris'                } });
  fireEvent.change(screen.getByLabelText('Code postal'),       { target: { name: 'codePostal',    value: '75001'               } });
}

const submitBtn = () => screen.getByRole('button', { name: /s'inscrire/i });

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


test('displays a success toaster after a valid submit', () => {
  render(<RegistrationForm />);
  fillValidForm();
  fireEvent.click(submitBtn());
  const alert = screen.getByRole('alert');
  expect(alert).toBeInTheDocument();
  expect(alert).toHaveClass('toast-success');
});

test('clears all fields after a valid submit', () => {
  render(<RegistrationForm />);
  fillValidForm();
  fireEvent.click(submitBtn());
  expect(screen.getByLabelText('Nom')).toHaveValue('');
  expect(screen.getByLabelText('Prénom')).toHaveValue('');
  expect(screen.getByLabelText('Adresse e-mail')).toHaveValue('');
  expect(screen.getByLabelText('Ville')).toHaveValue('');
  expect(screen.getByLabelText('Code postal')).toHaveValue('');
});

test('submit button is disabled again after a successful submit', () => {
  render(<RegistrationForm />);
  fillValidForm();
  fireEvent.click(submitBtn());
  expect(submitBtn()).toBeDisabled();
});


test('saves the registration to localStorage on valid submit', () => {
  localStorage.clear();
  render(<RegistrationForm />);
  fillValidForm();
  fireEvent.click(submitBtn());
  const saved = JSON.parse(localStorage.getItem('registrations'));
  expect(saved).toHaveLength(1);
  expect(saved[0].nom).toBe('Tepixtle');
  expect(saved[0].prenom).toBe('Julio');
  expect(saved[0].email).toBe('Julio.Tepixtle@gmail.com');
  expect(saved[0].codePostal).toBe('75001');
});

test('accumulates multiple registrations in localStorage', () => {
  localStorage.clear();
  render(<RegistrationForm />);
  fillValidForm();
  fireEvent.click(submitBtn());
  fillValidForm();
  fireEvent.click(submitBtn());
  const saved = JSON.parse(localStorage.getItem('registrations'));
  expect(saved).toHaveLength(2);
});

test('does not save to localStorage when the form is invalid', () => {
  localStorage.clear();
  render(<RegistrationForm />);
  expect(submitBtn()).toBeDisabled();
  expect(localStorage.getItem('registrations')).toBeNull();
});

test('handleSubmit guard: submitting an invalid form does nothing', () => {
  localStorage.clear();
  render(<RegistrationForm />);
  fireEvent.submit(screen.getByRole('form', { name: /inscription/i }));
  expect(localStorage.getItem('registrations')).toBeNull();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('useEffect cleanup: re-submitting clears the previous toast timer', () => {
  jest.useFakeTimers();
  render(<RegistrationForm />);
  fillValidForm();
  fireEvent.click(submitBtn());
  expect(screen.getByRole('alert')).toBeInTheDocument();
  act(() => { jest.advanceTimersByTime(4001); });
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  jest.useRealTimers();
});
