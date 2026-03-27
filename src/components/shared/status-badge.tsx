import { Badge } from '../ui/Badge';
import { ProductStatus } from '../../types/product.types';
import { SaleStatus } from '../../types/sale.types';
import { ServiceOrderStatus } from '../../types/service-order.types';
import {
  PRODUCT_STATUS_LABELS,
  SALE_STATUS_LABELS,
  SERVICE_ORDER_STATUS_LABELS,
} from '../../lib/constants';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary';

const PRODUCT_STATUS_VARIANT: Record<ProductStatus, BadgeVariant> = {
  DISPONIVEL: 'success',
  VENDIDO: 'info',
  RESERVADO: 'warning',
  DEVOLVIDO_AO_FORNECEDOR: 'secondary',
  IN_REPAIR: 'warning',
  CONSUMED_IN_BUYBACK_REPAIR: 'danger',
  CONSUMED_IN_SERVICE_ORDER: 'danger',
};

const SALE_STATUS_VARIANT: Record<SaleStatus, BadgeVariant> = {
  ORCAMENTO: 'warning',
  RESERVADO: 'info',
  CONCLUIDO: 'success',
  CANCELADO: 'danger',
  DEVOLVIDO: 'secondary',
};

const OS_STATUS_VARIANT: Record<ServiceOrderStatus, BadgeVariant> = {
  RECEIVED: 'info',
  IN_DIAGNOSIS: 'default',
  AWAITING_APPROVAL: 'warning',
  APPROVED: 'info',
  REJECTED: 'danger',
  IN_PROGRESS: 'warning',
  READY_FOR_PICKUP: 'success',
  DELIVERED: 'success',
  CANCELED: 'danger',
};

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge $variant={PRODUCT_STATUS_VARIANT[status]}>
      {PRODUCT_STATUS_LABELS[status]}
    </Badge>
  );
}

export function SaleStatusBadge({ status }: { status: SaleStatus }) {
  return (
    <Badge $variant={SALE_STATUS_VARIANT[status]}>
      {SALE_STATUS_LABELS[status]}
    </Badge>
  );
}

export function OSStatusBadge({ status }: { status: ServiceOrderStatus }) {
  return (
    <Badge $variant={OS_STATUS_VARIANT[status]}>
      {SERVICE_ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
