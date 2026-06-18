import axios from 'axios';

// En local : http://localhost:8000 (via .env)
// En production : URL du backend Vercel (via variable d'env Vercel/GitHub Actions)
const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const countUsers = async () => {
    try {
        const response = await axios.get(`${API}/users`);
        return response.data.utilisateurs.length;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getUsers = async () => {
    try {
        const response = await axios.get(`${API}/users`);
        return response.data.utilisateurs;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const createUser = async (userData) => {
    try {
        const response = await axios.post(`${API}/users`, userData);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API}/login`, credentials);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${API}/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
