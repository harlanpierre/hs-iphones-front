import api from './axios';
import { Page } from '../types/common.types';
import { PaymentRequest, SaleRequest, SaleResponse, SaleStatus } from '../types/sale.types';

interface SaleFilters {
  status?: SaleStatus;
  clientId?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
}

export const salesApi = {
  findAll: async (filters: SaleFilters = {}): Promise<Page<SaleResponse>> => {
    const { page = 0, size = 20, ...rest } = filters;
    const response = await api.get('/sales', { params: { page, size, ...rest } });
    return response.data;
  },

  findById: async (id: number): Promise<SaleResponse> => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },

  createBudget: async (data: SaleRequest): Promise<SaleResponse> => {
    const response = await api.post('/sales/budget', data);
    return response.data;
  },

  checkout: async (data: SaleRequest): Promise<SaleResponse> => {
    const response = await api.post('/sales/checkout', data);
    return response.data;
  },

  reserve: async (id: number): Promise<SaleResponse> => {
    const response = await api.put(`/sales/${id}/reserve`);
    return response.data;
  },

  pay: async (id: number, payments: PaymentRequest[]): Promise<SaleResponse> => {
    const response = await api.put(`/sales/${id}/pay`, payments);
    return response.data;
  },

  cancel: async (id: number): Promise<SaleResponse> => {
    const response = await api.put(`/sales/${id}/cancel`);
    return response.data;
  },

  returnSale: async (id: number): Promise<SaleResponse> => {
    const response = await api.put(`/sales/${id}/return`);
    return response.data;
  },

  getReceipt: async (id: number): Promise<string> => {
    const response = await api.get(`/sales/${id}/receipt`, { responseType: 'text' });
    return response.data;
  },
};
