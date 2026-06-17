import { countUsers } from './api';
import axios from 'axios';
jest.mock('axios');

describe('countUsers', () => {
  it('fetches successfully data from an API', async () => {
    const data = {
      data: {
        utilisateurs: [
          {
            id: '1',
            nom: 'a',
            prenom: 'b',
            email: 'c@c.fr'
          }
        ],
      },
    };

    axios.get.mockImplementationOnce(() => Promise.resolve(data));
    await expect(countUsers()).resolves.toEqual(1);
    expect(axios.get).toHaveBeenCalledWith(
      `http://localhost:3000/users`,
    );
  });

  it('fetches erroneously data from an API', async () => {
    const errorMessage = 'Network Error';

    axios.get.mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage)),
    );

    await expect(countUsers()).rejects.toThrow(errorMessage);
  });
});