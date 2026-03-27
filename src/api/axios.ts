import axios from 'axios';
import toast from 'react-hot-toast';
import { ErrorResponse } from '../types/common.types';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      const errorData = data as ErrorResponse;
      const message = errorData?.message || 'Erro inesperado. Tente novamente.';

      if (status === 400 && errorData?.fieldErrors?.length) {
        const fieldMessages = errorData.fieldErrors.map((f) => f.message).join('\n');
        toast.error(fieldMessages);
      } else if (status === 403) {
        toast.error('Acesso negado. Voce nao tem permissao para esta acao.');
      } else if (status >= 400 && status < 500) {
        toast.error(message);
      } else if (status >= 500) {
        toast.error('Erro interno do servidor. Tente novamente mais tarde.');
      }
    } else {
      toast.error('Erro de conexao. Verifique sua rede.');
    }

    return Promise.reject(error);
  }
);

export default api;
