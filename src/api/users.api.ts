import api from './axios';
import type { Page } from '../types/common.types';
import type { UserRequest, UserResponse } from '../types/user.types';

export const usersApi = {
  findAll: async (page = 0, size = 20, search?: string): Promise<Page<UserResponse>> => {
    const response = await api.get('/users', { params: { page, size, search } });
    return response.data;
  },

  findById: async (id: number): Promise<UserResponse> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: UserRequest): Promise<UserResponse> => {
    const response = await api.post('/users', data);
    return response.data;
  },

  update: async (id: number, data: UserRequest): Promise<UserResponse> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
