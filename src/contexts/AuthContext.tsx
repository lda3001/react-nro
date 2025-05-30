import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

interface User  {
  id: number;
  username: string;
  vnd: number;
  character: {
    id: number;
    name: string;
    infochar: string;
  };
  // Add other user properties as needed
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, repassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUserData = async () => {
    try {
      const userData = await authAPI.getCurrentUser() as ApiResponse<User>;
      const userDataParsed = userData.data;
      localStorage.setItem('user', JSON.stringify(userDataParsed));
      setUser(userDataParsed);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    }
  };

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem('token');
    
    if (token) {
      fetchUserData();
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authAPI.login({ username, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      const userData = await authAPI.getCurrentUser() as ApiResponse<User>;
      const userDataParsed = userData.data;
      localStorage.setItem('user', JSON.stringify(userDataParsed));
      
      setUser(userDataParsed);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, password: string, repassword: string) => {
    try {
      await authAPI.register({ username, password, repassword });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 