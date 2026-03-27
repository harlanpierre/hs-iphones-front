export type ServiceOrderStatus =
  | 'RECEIVED'
  | 'IN_DIAGNOSIS'
  | 'AWAITING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'IN_PROGRESS'
  | 'READY_FOR_PICKUP'
  | 'DELIVERED'
  | 'CANCELED';

export interface ServiceOrderRequest {
  clientId: number;
  deviceModel: string;
  deviceImeiSerial?: string;
  reportedIssue: string;
}

export interface ServiceOrderPartRequest {
  productId: number;
  quantity: number;
}

export interface ServiceOrderItemResponse {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ServiceOrderResponse {
  id: number;
  clientName: string;
  deviceModel: string;
  reportedIssue: string;
  diagnostic: string;
  status: ServiceOrderStatus;
  laborCost: number;
  partsCost: number;
  discountAmount: number;
  totalAmount: number;
  createdAt: string;
  completedAt: string;
  items: ServiceOrderItemResponse[];
}
