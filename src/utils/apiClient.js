import axios from 'axios';

// Crear una instancia personalizada de axios para la API
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000, // 10 segundos de timeout
});

// Función helper para verificar si un error es por token expirado
export const isTokenExpiredError = (error) => {
  if (error.response?.status !== 401) return false;
  
  const errorMessage = error.response?.data?.error || error.response?.data?.message || '';
  
  return (
    errorMessage.toLowerCase().includes('token expired') ||
    errorMessage.toLowerCase().includes('jwt expired') ||
    errorMessage.toLowerCase().includes('token invalid') ||
    errorMessage.toLowerCase().includes('unauthorized')
  );
};

// Función helper para hacer peticiones con manejo automático de token expirado
export const makeAuthenticatedRequest = async (requestConfig, onTokenExpired) => {
  try {
    return await apiClient(requestConfig);
  } catch (error) {
    if (isTokenExpiredError(error) && onTokenExpired) {
      console.log('Token expired detected in request, triggering logout...');
      onTokenExpired();
    }
    throw error;
  }
};

// Interceptor de respuesta para la instancia personalizada
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detallado de errores para debugging
    if (error.response?.status === 401) {
      console.log('401 Error Details:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
