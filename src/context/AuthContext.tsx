import { createContext, useContext, useState, type ReactNode, type FC } from 'react';
import { toast } from 'react-toastify';
import type { AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = 'token';
const EXPIRY_KEY = 'token_expiry';

const getValidToken = (): string | null => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const expiry = sessionStorage.getItem(EXPIRY_KEY);

  if (token && expiry && Date.now() < Number(expiry)) {
    return token;
  }

  sessionStorage.clear();
  return null;
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getValidToken());

  const login = (newToken: string): void => {
    const expiryTime = Date.now() + 30 * 60 * 1000;

    sessionStorage.setItem(TOKEN_KEY, newToken);
    sessionStorage.setItem(EXPIRY_KEY, expiryTime.toString());

    setToken(newToken);
  };

  const logout = (): void => {
    sessionStorage.clear();
    setToken(null);
    toast.success('Logged out successfully');
  };

  return <AuthContext.Provider value={{ token, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
