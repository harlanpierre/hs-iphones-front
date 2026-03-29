import api from './axios';
import type { Page } from '../types/common.types';
import type { SupplierRequest, SupplierResponse } from '../types/supplier.types';

export const suppliersApi = {
  findAll: async (page = 0, size = 20, filter?: string): Promise<Page<SupplierResponse>> => {
    const response = await api.get('/suppliers', { params: { page, size, filter } });
    return response.data;
  },

  findById: async (id: number): Promise<SupplierResponse> => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  create: async (data: SupplierRequest): Promise<SupplierResponse> => {
    const response = await api.post('/suppliers', data);
    return response.data;
  },

  update: async (id: number, data: SupplierRequest): Promise<SupplierResponse> => {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/suppliers/${id}`);
  },
};
