import api from './axios';
import type { Page } from '../types/common.types';
import type { ProductCategory, ProductRequest, ProductResponse, ProductStatus } from '../types/product.types';

export const productsApi = {
  findAll: async (page = 0, size = 20): Promise<Page<ProductResponse>> => {
    const response = await api.get('/products', { params: { page, size } });
    return response.data;
  },

  findAvailable: async (page = 0, size = 20): Promise<Page<ProductResponse>> => {
    const response = await api.get('/products/available', { params: { page, size } });
    return response.data;
  },

  findByFilter: async (category: ProductCategory, status: ProductStatus, page = 0, size = 20): Promise<Page<ProductResponse>> => {
    const response = await api.get('/products/filter', { params: { category, status, page, size } });
    return response.data;
  },

  findById: async (id: number): Promise<ProductResponse> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  findByImeiHistory: async (imei: string): Promise<ProductResponse[]> => {
    const response = await api.get(`/products/history/${imei}`);
    return response.data;
  },

  create: async (data: ProductRequest): Promise<ProductResponse> => {
    const response = await api.post('/products', data);
    return response.data;
  },

  update: async (id: number, data: ProductRequest): Promise<ProductResponse> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
