export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  username: string;
  name: string;
  role: string;
}

export type UserRole = 'ADMIN' | 'VENDEDOR' | 'TECNICO';
