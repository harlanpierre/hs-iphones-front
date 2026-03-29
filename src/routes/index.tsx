import { createBrowserRouter } from 'react-router';
import { AppLayout } from '../components/layout/app-layout';
import { PrivateRoute } from './private-route';
import { LandingPage } from '../pages/landing/landing-page';
import { LoginPage } from '../pages/login/login-page';
import { RegisterPage } from '../pages/register/register-page';
import { PlansPage } from '../pages/plans/plans-page';
import { SubscriptionPage } from '../pages/subscription/subscription-page';
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
import { UsersPage } from '../pages/users/users-page';
import { UserFormPage } from '../pages/users/user-form-page';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password-page';
import { ResetPasswordPage } from '../pages/reset-password/reset-password-page';

export const router = createBrowserRouter([
  // Rotas publicas
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/planos',
    element: <PlansPage />,
  },

  // Rotas autenticadas
  {
    element: (
      <PrivateRoute>
        <AppLayout />
      </PrivateRoute>
    ),
    children: [
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

      // Usuarios
      { path: 'usuarios', element: <PrivateRoute roles={['ADMIN']}><UsersPage /></PrivateRoute> },
      { path: 'usuarios/novo', element: <PrivateRoute roles={['ADMIN']}><UserFormPage /></PrivateRoute> },
      { path: 'usuarios/:id/editar', element: <PrivateRoute roles={['ADMIN']}><UserFormPage /></PrivateRoute> },

      // Assinatura
      { path: 'assinatura', element: <PrivateRoute roles={['ADMIN']}><SubscriptionPage /></PrivateRoute> },
    ],
  },
]);
