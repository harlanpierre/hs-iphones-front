import { ClientResponse } from './client.types';
import { SupplierResponse } from './supplier.types';

export type ProductCategory = 'CELULAR' | 'ACESSORIO' | 'PECA' | 'OUTROS';

export type ProductStatus =
  | 'DISPONIVEL'
  | 'VENDIDO'
  | 'RESERVADO'
  | 'DEVOLVIDO_AO_FORNECEDOR'
  | 'IN_REPAIR'
  | 'CONSUMED_IN_BUYBACK_REPAIR'
  | 'CONSUMED_IN_SERVICE_ORDER';

export interface ProductRequest {
  name: string;
  description?: string;
  sku?: string;
  category: ProductCategory;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  minStock?: number;
  imeis?: string[];
  compatibleModel?: string;
  warrantyDays?: number;
  supplierWarrantyStartDate?: string;
  supplierWarrantyEndDate?: string;
  repairCost?: number;
  supplierId?: number;
  clientId?: number;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  sku: string;
  category: ProductCategory;
  status: ProductStatus;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  minStock: number;
  imeis: string[];
  compatibleModel: string;
  warrantyDays: number;
  supplierWarrantyStartDate: string;
  supplierWarrantyEndDate: string;
  repairCost: number;
  supplier: SupplierResponse;
  client: ClientResponse;
}
