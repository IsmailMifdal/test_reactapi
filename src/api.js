import axios from 'axios';
const port = process.env.REACT_APP_SERVER_PORT;
const API = `http://localhost:${port}`;

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
