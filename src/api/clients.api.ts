import api from './axios';
import type { Page } from '../types/common.types';
import type { ClientRequest, ClientResponse } from '../types/client.types';

export const clientsApi = {
  findAll: async (page = 0, size = 20, search?: string): Promise<Page<ClientResponse>> => {
    const response = await api.get('/clients', { params: { page, size, search } });
    return response.data;
  },

  findById: async (id: number): Promise<ClientResponse> => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  findByCpf: async (cpf: string): Promise<ClientResponse> => {
    const response = await api.get(`/clients/cpf/${cpf}`);
    return response.data;
  },

  create: async (data: ClientRequest): Promise<ClientResponse> => {
    const response = await api.post('/clients', data);
    return response.data;
  },

  update: async (id: number, data: ClientRequest): Promise<ClientResponse> => {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};
