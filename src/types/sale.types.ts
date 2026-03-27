export type SaleStatus = 'ORCAMENTO' | 'RESERVADO' | 'CONCLUIDO' | 'CANCELADO' | 'DEVOLVIDO';

export type PaymentMethod = 'PIX' | 'CREDITO' | 'DEBITO' | 'DINHEIRO' | 'BUYBACK';

export interface SaleItemRequest {
  productId: number;
  imei?: string;
  quantity: number;
  isFreebie?: boolean;
}

export interface PaymentRequest {
  method: PaymentMethod;
  amount: number;
  installments?: number;
  buybackProductId?: number;
}

export interface SaleRequest {
  clientId: number;
  sellerName?: string;
  notes?: string;
  discountAmount?: number;
  items: SaleItemRequest[];
  payments?: PaymentRequest[];
}

export interface SaleItemResponse {
  id: number;
  productName: string;
  sku: string;
  imei: string;
  quantity: number;
  subtotal: number;
  warrantyEndDate: string;
  isFreebie: boolean;
}

export interface PaymentResponse {
  id: number;
  method: PaymentMethod;
  amount: number;
  installments: number;
  buybackProductName: string;
}

export interface SaleResponse {
  id: number;
  clientName: string;
  sellerName: string;
  status: SaleStatus;
  totalAmount: number;
  discountAmount: number;
  netAmount: number;
  notes: string;
  createdAt: string;
  items: SaleItemResponse[];
  payments: PaymentResponse[];
}
