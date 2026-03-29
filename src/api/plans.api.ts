import api from './axios';
import type { PlanResponse, SubscriptionResponse } from '../types/subscription.types';

export const plansApi = {
  listPlans: async (): Promise<PlanResponse[]> => {
    const response = await api.get<PlanResponse[]>('/plans');
    return response.data;
  },

  getSubscription: async (): Promise<SubscriptionResponse> => {
    const response = await api.get<SubscriptionResponse>('/subscription');
    return response.data;
  },

  changePlan: async (planId: number): Promise<SubscriptionResponse> => {
    const response = await api.put<SubscriptionResponse>(`/subscription/change-plan/${planId}`);
    return response.data;
  },
};
