export interface DashboardData {
  kpis: {
    salesCount: number;
    revenue: number;
    avgTicket: number;
    openServiceOrders: number;
    productsInStock: number;
    lowStockProducts: number;
    newClients: number;
  };
  salesByDay: Array<{ date: string; count: number; revenue: number }>;
  salesByStatus: Array<{ status: string; count: number }>;
  serviceOrdersByStatus: Array<{ status: string; count: number }>;
  productsByCategory: Array<{ category: string; count: number }>;
  lowStockAlerts: Array<{ id: number; name: string; quantity: number; minStock: number }>;
  recentSales: Array<{ id: number; clientName: string; netAmount: number; status: string; createdAt: string }>;
  pendingServiceOrders: Array<{ id: number; clientName: string; deviceModel: string; status: string; createdAt: string }>;
}
