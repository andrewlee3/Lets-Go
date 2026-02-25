'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { storage } from '@/utils/storage';
import type { TableAuth } from '@/types/auth.types';

interface AuthContextValue {
  auth: TableAuth | null;
  isAuthenticated: boolean;
  login: (auth: TableAuth) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_STORAGE_KEY = 'table_auth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<TableAuth | null>(null);

  // 자동 로그인: localStorage에서 인증 정보 로드
  useEffect(() => {
    const savedAuth = storage.get<TableAuth>(AUTH_STORAGE_KEY);
    if (savedAuth) {
      setAuth(savedAuth);
    }
  }, []);

  const login = (authData: TableAuth) => {
    setAuth(authData);
    storage.set(AUTH_STORAGE_KEY, authData);
  };

  const logout = () => {
    setAuth(null);
    storage.remove(AUTH_STORAGE_KEY);
  };

  const isAuthenticated = auth !== null;

  return (
    <AuthContext.Provider value={{ auth, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
