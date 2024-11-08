'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token); // Store JWT
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove JWT
    setIsAuthenticated(false);
  };
  const getToken = () => {
    return localStorage.getItem('token'); // Retrieve the token from local storage
  };

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
