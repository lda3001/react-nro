import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '../services/api';

interface User  {
  id: number;
  username: string;
  role: number;
  vnd: number;
  character?: {
    name?: string;
    infochar?: string;
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
  changePassword: (oldpassword: string, newpassword: string, repassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      // Decode the JWT token to get expiration time
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const { exp } = JSON.parse(jsonPayload);
      const currentTime = Math.floor(Date.now() / 1000);

      return exp > currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return false;
    }
  };

  const fetchUserData = async () => {
    try {
      if (!checkTokenExpiration()) {
        logout();
        return;
      }

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
      if (!checkTokenExpiration()) {
        logout();
      } else {
        fetchUserData();
      }
    }
  }, []);

  // Add interval to check token expiration
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAuthenticated && !checkTokenExpiration()) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated]);

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

  const changePassword = async (oldpassword: string, newpassword: string, repassword: string) => {
    try {
      await userAPI.changePassword({ oldpassword, newpassword, repassword });
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, changePassword }}>
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