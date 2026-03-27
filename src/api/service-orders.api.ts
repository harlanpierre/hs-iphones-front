import api from './axios';
import { Page } from '../types/common.types';
import { ServiceOrderPartRequest, ServiceOrderRequest, ServiceOrderResponse, ServiceOrderStatus } from '../types/service-order.types';

interface ServiceOrderFilters {
  status?: ServiceOrderStatus;
  clientId?: number;
  page?: number;
  size?: number;
}

export const serviceOrdersApi = {
  findAll: async (filters: ServiceOrderFilters = {}): Promise<Page<ServiceOrderResponse>> => {
    const { page = 0, size = 20, ...rest } = filters;
    const response = await api.get('/services/os', { params: { page, size, ...rest } });
    return response.data;
  },

  findById: async (id: number): Promise<ServiceOrderResponse> => {
    const response = await api.get(`/services/os/${id}`);
    return response.data;
  },

  create: async (data: ServiceOrderRequest): Promise<ServiceOrderResponse> => {
    const response = await api.post('/services/os', data);
    return response.data;
  },

  addPart: async (id: number, data: ServiceOrderPartRequest): Promise<void> => {
    await api.post(`/services/os/${id}/parts`, data);
  },

  updateStatus: async (id: number, status: ServiceOrderStatus): Promise<void> => {
    await api.put(`/services/os/${id}/status`, null, { params: { status } });
  },
};
