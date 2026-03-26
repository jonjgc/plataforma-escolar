import React, { createContext, useState, ReactNode } from 'react';
import { api } from '../services/api';

interface AuthContextData {
  token: string | null;
  role: 'PROFESSOR' | 'ALUNO' | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('@PlataformaEscolar:token'));
  const [role, setRole] = useState<'PROFESSOR' | 'ALUNO' | null>(() => {
    const savedToken = localStorage.getItem('@PlataformaEscolar:token');
    if (savedToken) {
      const payload = JSON.parse(atob(savedToken.split('.')[1]));
      return payload.role;
    }
    return null;
  });

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login/', { email, password });
    const { access } = response.data;
    
    localStorage.setItem('@PlataformaEscolar:token', access);
    setToken(access);
    
    const payload = JSON.parse(atob(access.split('.')[1]));
    setRole(payload.role);
  };

  const logout = () => {
    localStorage.removeItem('@PlataformaEscolar:token');
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};