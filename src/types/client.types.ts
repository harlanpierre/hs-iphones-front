export interface AddressRequest {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface AddressResponse {
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ClientRequest {
  name: string;
  cpf: string;
  email: string;
  phone?: string;
  address: AddressRequest;
}

export interface ClientResponse {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  address: AddressResponse;
}
