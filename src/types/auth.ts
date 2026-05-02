import type { User } from './user';

export interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export interface LoginResponseData {
  token: string;
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}
export interface AddOrUpdateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  username: string;
  role: string;
  status: string;
}
