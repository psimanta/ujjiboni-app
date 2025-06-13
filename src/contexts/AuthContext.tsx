import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { storage } from '../utils/local-storage';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(storage.get('token'));

  const login = (newToken: string) => {
    setToken(newToken);
    storage.set('token', newToken);
  };

  const logout = () => {
    setToken(null);
    storage.remove('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
