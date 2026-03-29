import api from './axios';
import type { InternalRepairRequest, InternalRepairResponse } from '../types/repair.types';

export const repairsApi = {
  create: async (data: InternalRepairRequest): Promise<InternalRepairResponse> => {
    const response = await api.post('/repairs/internal', data);
    return response.data;
  },

  finish: async (phoneId: number): Promise<void> => {
    await api.put(`/repairs/internal/${phoneId}/finish`);
  },
};
