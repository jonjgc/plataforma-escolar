import React, { createContext, useState, ReactNode } from 'react';
import { api } from '../services/api';

interface AuthContextData {
  token: string | null;
  role: 'PROFESSOR' | 'ALUNO' | null;
  nome: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('@PlataformaEscolar:token'));
  const [role, setRole] = useState<'PROFESSOR' | 'ALUNO' | null>(() => {
    const savedToken = localStorage.getItem('@PlataformaEscolar:token');
    if (savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        return payload.role;
      } catch (e) { return null; }
    }
    return null;
  });

  const [nome, setNome] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('@PlataformaEscolar:token');
    const savedName = localStorage.getItem('@PlataformaEscolar:nome');
    if (savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        return payload.nome || savedName;
      } catch (e) { return null; }
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

    const nomeUsuario = response.data.nome || payload.nome || 'Usuário';
    setNome(nomeUsuario);
    localStorage.setItem('@PlataformaEscolar:nome', nomeUsuario);
  };

  const logout = () => {
    localStorage.removeItem('@PlataformaEscolar:token');
    localStorage.removeItem('@PlataformaEscolar:nome');
    setToken(null);
    setRole(null);
    setNome(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, nome, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};