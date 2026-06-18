import { countUsers, getUsers, createUser, loginUser, deleteUser } from './api';
import axios from 'axios';
jest.mock('axios');

const mockUser = { id: '1', nom: 'a', prenom: 'b', email: 'c@c.fr' };

describe('countUsers', () => {
  it('fetches successfully data from an API', async () => {
    const data = { data: { utilisateurs: [mockUser] } };
    axios.get.mockImplementationOnce(() => Promise.resolve(data));
    await expect(countUsers()).resolves.toEqual(1);
    expect(axios.get).toHaveBeenCalledWith(`http://localhost:3000/users`);
  });

  it('fetches erroneously data from an API', async () => {
    const errorMessage = 'Network Error';
    axios.get.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
    await expect(countUsers()).rejects.toThrow(errorMessage);
  });
});

describe('getUsers', () => {
  it('returns the list of users', async () => {
    const data = { data: { utilisateurs: [mockUser] } };
    axios.get.mockImplementationOnce(() => Promise.resolve(data));
    await expect(getUsers()).resolves.toEqual([mockUser]);
  });

  it('throws on error', async () => {
    axios.get.mockImplementationOnce(() => Promise.reject(new Error('fail')));
    await expect(getUsers()).rejects.toThrow('fail');
  });
});

describe('createUser', () => {
  it('sends a POST and returns data', async () => {
    const response = { data: { message: 'Utilisateur créé', id: 1 } };
    axios.post.mockImplementationOnce(() => Promise.resolve(response));
    await expect(createUser(mockUser)).resolves.toEqual(response.data);
  });

  it('throws on error', async () => {
    axios.post.mockImplementationOnce(() => Promise.reject(new Error('fail')));
    await expect(createUser(mockUser)).rejects.toThrow('fail');
  });
});

describe('loginUser', () => {
  it('sends a POST /login and returns data', async () => {
    const response = { data: { message: 'Connexion réussie', user: mockUser } };
    axios.post.mockImplementationOnce(() => Promise.resolve(response));
    await expect(loginUser({ email: 'a@a.fr', password: '123' })).resolves.toEqual(response.data);
  });

  it('throws on error', async () => {
    axios.post.mockImplementationOnce(() => Promise.reject(new Error('Unauthorized')));
    await expect(loginUser({ email: 'bad', password: 'bad' })).rejects.toThrow('Unauthorized');
  });
});

describe('deleteUser', () => {
  it('sends a DELETE request and returns data', async () => {
    const response = { data: { message: 'Utilisateur supprimé' } };
    axios.delete.mockImplementationOnce(() => Promise.resolve(response));
    await expect(deleteUser(1)).resolves.toEqual(response.data);
  });

  it('throws on error', async () => {
    axios.delete.mockImplementationOnce(() => Promise.reject(new Error('Not Found')));
    await expect(deleteUser(999)).rejects.toThrow('Not Found');
  });
});