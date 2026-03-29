import api from './axios';
import type { AddressResponse } from '../types/client.types';

export const cepApi = {
  lookup: async (cep: string): Promise<AddressResponse> => {
    const response = await api.get(`/cep/${cep.replace(/\D/g, '')}`);
    return response.data;
  },
};
