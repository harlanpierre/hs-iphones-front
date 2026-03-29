import type { UserRole } from './auth.types';

export interface UserResponse {
  id: number;
  username: string;
  name: string;
  email?: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface UserRequest {
  username: string;
  email?: string;
  password?: string;
  name: string;
  role: UserRole;
}
