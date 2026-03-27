import { createBrowserRouter, Navigate } from 'react-router';
import { AppLayout } from '../components/layout/app-layout';
import { PrivateRoute } from './private-route';
import { LoginPage } from '../pages/login/login-page';
import { DashboardPage } from '../pages/dashboard/dashboard-page';
import { ProductsPage } from '../pages/products/products-page';
import { ProductFormPage } from '../pages/products/product-form-page';
import { ProductDetailPage } from '../pages/products/product-detail-page';
import { ClientsPage } from '../pages/clients/clients-page';
import { ClientFormPage } from '../pages/clients/client-form-page';
import { SuppliersPage } from '../pages/suppliers/suppliers-page';
import { SupplierFormPage } from '../pages/suppliers/supplier-form-page';
import { SalesPage } from '../pages/sales/sales-page';
import { SaleCheckoutPage } from '../pages/sales/sale-checkout-page';
import { SaleDetailPage } from '../pages/sales/sale-detail-page';
import { ServiceOrdersPage } from '../pages/service-orders/service-orders-page';
import { ServiceOrderFormPage } from '../pages/service-orders/service-order-form-page';
import { ServiceOrderDetailPage } from '../pages/service-orders/service-order-detail-page';
import { RepairsPage } from '../pages/repairs/repairs-page';
import { RepairFormPage } from '../pages/repairs/repair-form-page';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },

      // Produtos
      { path: 'produtos', element: <ProductsPage /> },
      { path: 'produtos/novo', element: <PrivateRoute roles={['ADMIN', 'VENDEDOR']}><ProductFormPage /></PrivateRoute> },
      { path: 'produtos/:id', element: <ProductDetailPage /> },
      { path: 'produtos/:id/editar', element: <PrivateRoute roles={['ADMIN']}><ProductFormPage /></PrivateRoute> },

      // Clientes
      { path: 'clientes', element: <PrivateRoute roles={['ADMIN', 'VENDEDOR']}><ClientsPage /></PrivateRoute> },
      { path: 'clientes/novo', element: <PrivateRoute roles={['ADMIN', 'VENDEDOR']}><ClientFormPage /></PrivateRoute> },
      { path: 'clientes/:id/editar', element: <PrivateRoute roles={['ADMIN', 'VENDEDOR']}><ClientFormPage /></PrivateRoute> },

      // Fornecedores
      { path: 'fornecedores', element: <PrivateRoute roles={['ADMIN']}><SuppliersPage /></PrivateRoute> },
      { path: 'fornecedores/novo', element: <PrivateRoute roles={['ADMIN']}><SupplierFormPage /></PrivateRoute> },
      { path: 'fornecedores/:id/editar', element: <PrivateRoute roles={['ADMIN']}><SupplierFormPage /></PrivateRoute> },

      // Vendas
      { path: 'vendas', element: <PrivateRoute roles={['ADMIN', 'VENDEDOR']}><SalesPage /></PrivateRoute> },
      { path: 'vendas/novo', element: <PrivateRoute roles={['ADMIN', 'VENDEDOR']}><SaleCheckoutPage /></PrivateRoute> },
      { path: 'vendas/:id', element: <PrivateRoute roles={['ADMIN', 'VENDEDOR']}><SaleDetailPage /></PrivateRoute> },

      // Ordens de Servico
      { path: 'assistencia', element: <PrivateRoute roles={['ADMIN', 'TECNICO']}><ServiceOrdersPage /></PrivateRoute> },
      { path: 'assistencia/nova', element: <PrivateRoute roles={['ADMIN', 'TECNICO']}><ServiceOrderFormPage /></PrivateRoute> },
      { path: 'assistencia/:id', element: <PrivateRoute roles={['ADMIN', 'TECNICO']}><ServiceOrderDetailPage /></PrivateRoute> },

      // Reparos Internos
      { path: 'reparos', element: <PrivateRoute roles={['ADMIN', 'TECNICO']}><RepairsPage /></PrivateRoute> },
      { path: 'reparos/novo', element: <PrivateRoute roles={['ADMIN', 'TECNICO']}><RepairFormPage /></PrivateRoute> },
    ],
  },
]);
