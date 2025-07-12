import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Iniciamos con loading true

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Inicializar el estado de autenticación al cargar la app
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false); // Terminamos el loading inicial
    };

    initializeAuth();
  }, []);

  // Interceptor para manejar token expirado
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Verificar si es un error de token expirado específicamente
        if (error.response?.status === 401 && token) {
          const errorMessage = error.response?.data?.error || error.response?.data?.message || '';
          
          // Detectar diferentes variantes del mensaje de token expirado
          const isTokenExpired = 
            errorMessage.toLowerCase().includes('token expired') ||
            errorMessage.toLowerCase().includes('jwt expired') ||
            errorMessage.toLowerCase().includes('token invalid') ||
            errorMessage.toLowerCase().includes('unauthorized');
          
          if (isTokenExpired) {
            console.log('Token expired, logging out automatically...');
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, credentials);
      const { token: authToken } = response.data;
      
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setIsAuthenticated(true);
      
      // Configurar el header de Authorization para futuras peticiones
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    token,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};