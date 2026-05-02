import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type FC,
} from 'react';
import { toast } from 'react-toastify';
import type { AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const login = (newToken: string): void => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setToken(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
