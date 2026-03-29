import api from './axios';
import type { DashboardData } from '../types/dashboard.types';

export const dashboardApi = {
  getData: async (month: number, year: number): Promise<DashboardData> => {
    const response = await api.get<DashboardData>('/dashboard', { params: { month, year } });
    return response.data;
  },
};
