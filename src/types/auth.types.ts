export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  role: UserRole;
  tenantName: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  name: string;
  role: string;
  tenantId: number;
  tenantName: string;
}

export type UserRole = 'ADMIN' | 'VENDEDOR' | 'TECNICO';
