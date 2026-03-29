export interface PlanResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  priceMonthly: number;
  maxProducts: number;
  maxClients: number;
  maxUsers: number;
  maxSalesPerMonth: number;
  maxServiceOrdersPerMonth: number;
}

export interface UsageResponse {
  products: number;
  clients: number;
  users: number;
  salesThisMonth: number;
  serviceOrdersThisMonth: number;
}

export interface SubscriptionResponse {
  id: number;
  status: string;
  startedAt: string;
  expiresAt: string | null;
  plan: PlanResponse;
  usage: UsageResponse;
}
