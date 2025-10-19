import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await api.getCurrentUser();
        setUser(response.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      api.clearToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const response = await api.login(username, password);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  const register = async (userData) => {
    return await api.register(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
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
