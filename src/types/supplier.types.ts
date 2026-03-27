export interface SupplierRequest {
  name: string;
  cpfCnpj?: string;
  phone: string;
}

export interface SupplierResponse {
  id: number;
  name: string;
  cpfCnpj: string;
  phone: string;
}
