import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storage } from '../utils/storage';
import { handleApiError } from '../utils/errorHandler';

const API_BASE_URL = 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

// Procesa todas las peticiones acumuladas mientras se renovaba el token
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Función encargada de refrescar el token de forma aislada
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await storage.getRefreshToken();
    
    if (!refreshToken) {
      await storage.clearAll();
      return null;
    }

    // Petición directa con axios (sin usar la instancia apiClient) para no activar interceptores
    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    if (!accessToken) {
      throw new Error('No se recibió un nuevo accessToken');
    }

    await storage.saveToken(accessToken);
    if (newRefreshToken) {
      await storage.saveRefreshToken(newRefreshToken);
    }
    
    return accessToken;
  } catch (error) {
    // Si el refresh token caducó o falló, borramos credenciales
    await storage.clearAll();
    return null;
  }
};

// Interceptor de Solicitudes (Attach Token)
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await storage.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return config;
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de Respuestas (Refresh Token & Queueing)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) {
      return Promise.reject(handleApiError(error));
    }

    const isAuthRoute = originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login');

    // Si el error es 401, no se ha reintentado y no es una ruta de autenticación
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        // Si ya hay una renovación en curso, encolar la petición actual
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          processQueue(null, newToken);
          return apiClient(originalRequest);
        } else {
          processQueue(error, null);
          return Promise.reject(handleApiError(error));
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(handleApiError(refreshError));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(handleApiError(error));
  }
);
