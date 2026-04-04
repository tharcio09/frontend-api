import axios from 'axios';
import toast from 'react-hot-toast';

export const api = axios.create({
    baseURL: 'http://localhost:3000',
});


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('meu_token_vip');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || "Erro inesperado no servidor.";
        toast.error(message);
        return Promise.reject(error);
    }
);

