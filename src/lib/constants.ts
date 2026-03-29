import type { ProductCategory, ProductStatus } from '../types/product.types';
import type { SaleStatus, PaymentMethod } from '../types/sale.types';
import type { ServiceOrderStatus } from '../types/service-order.types';
import type { UserRole } from '../types/auth.types';

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  CELULAR: 'Celular',
  ACESSORIO: 'Acessorio',
  PECA: 'Peca',
  OUTROS: 'Outros',
};

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  DISPONIVEL: 'Disponivel',
  VENDIDO: 'Vendido',
  RESERVADO: 'Reservado',
  DEVOLVIDO_AO_FORNECEDOR: 'Devolvido ao Fornecedor',
  IN_REPAIR: 'Em Reparo',
  CONSUMED_IN_BUYBACK_REPAIR: 'Usado em Reparo Interno',
  CONSUMED_IN_SERVICE_ORDER: 'Usado em OS',
};

export const SALE_STATUS_LABELS: Record<SaleStatus, string> = {
  ORCAMENTO: 'Orcamento',
  RESERVADO: 'Reservado',
  CONCLUIDO: 'Concluido',
  CANCELADO: 'Cancelado',
  DEVOLVIDO: 'Devolvido',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  PIX: 'PIX',
  CREDITO: 'Cartao de Credito',
  DEBITO: 'Cartao de Debito',
  DINHEIRO: 'Dinheiro',
  BUYBACK: 'Retoma (BuyBack)',
};

export const SERVICE_ORDER_STATUS_LABELS: Record<ServiceOrderStatus, string> = {
  RECEIVED: 'Recebido',
  IN_DIAGNOSIS: 'Em Diagnostico',
  AWAITING_APPROVAL: 'Aguardando Aprovacao',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
  IN_PROGRESS: 'Em Conserto',
  READY_FOR_PICKUP: 'Pronto para Retirada',
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado',
};

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  VENDEDOR: 'Vendedor',
  TECNICO: 'Tecnico',
};

export const PAGINATION_DEFAULT_SIZE = 20;
