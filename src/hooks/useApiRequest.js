import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { makeAuthenticatedRequest } from '../utils/apiClient';
import axios from 'axios';

/**
 * Hook personalizado para hacer peticiones autenticadas con manejo automático de token expirado
 */
export const useApiRequest = () => {
  const { token, logout, isAuthenticated } = useAuth();

  const apiRequest = useCallback(async (config) => {
    // Permitir peticiones GET sin token
    if (config.method === 'GET' && !token) {
      return axios({
        ...config,
        baseURL: process.env.REACT_APP_API_URL,
        timeout: 10000
      });
    }

    if (!token) {
      throw new Error('No authentication token available');
    }

    const requestConfig = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`
      }
    };

    return makeAuthenticatedRequest(requestConfig, logout);
  }, [token, logout]);

  // Funciones helper para diferentes tipos de peticiones
  const get = useCallback((url, config = {}) => {
    return apiRequest({ ...config, url, method: 'GET' });
  }, [apiRequest]);

  const post = useCallback((url, data, config = {}) => {
    return apiRequest({ ...config, url, method: 'POST', data });
  }, [apiRequest]);

  const put = useCallback((url, data, config = {}) => {
    return apiRequest({ ...config, url, method: 'PUT', data });
  }, [apiRequest]);

  const del = useCallback((url, config = {}) => {
    return apiRequest({ ...config, url, method: 'DELETE' });
  }, [apiRequest]);

  return {
    apiRequest,
    get,
    post,
    put,
    delete: del,
    isAuthenticated
  };
};

export default useApiRequest;
