import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '../constants/api';
import { storage } from '../utils/storage';
import { handleApiError } from '../utils/errorHandler';

// La URL base sale de constants/api.ts (un solo lugar para cambiarla)
const API_BASE_URL = `${API_URL}/api`;

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

// Cuando el access token vence (401), se pide uno nuevo a POST /auth/refresh con el
// refresh token guardado y se repite la petición. Si no hay refresh token, el 401 se informa tal cual.
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await storage.getRefreshToken();

    if (!refreshToken) {
      return null;
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    await storage.saveToken(accessToken);
    if (newRefreshToken) {
      await storage.saveRefreshToken(newRefreshToken);
    }

    return accessToken;
  } catch (error) {
    console.error('Error refrescando token:', error);
    await storage.clearAll();
    return null;
  }
};

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await storage.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error en interceptor request:', error);
      return config;
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // En el login un 401 son credenciales incorrectas: no se intenta renovar el token
    const isLoginRequest = originalRequest?.url?.includes('/auth/login');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isLoginRequest
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return apiClient(originalRequest);
        } else {
          processQueue(error, null);
          const apiError = handleApiError(error);
          return Promise.reject(apiError);
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
