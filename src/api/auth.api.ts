import { apiClient } from './client';
import { storage } from '../utils/storage';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // La API responde { accessToken, refreshToken, user }
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // POST /students crea al estudiante pero no devuelve token,
  // así que después de crearlo se inicia sesión con las mismas credenciales.
  register: async (data: RegisterData): Promise<AuthResponse> => {
    await apiClient.post('/students', data);
    return authApi.login({ email: data.email, password: data.password });
  },

  // GET /auth/me responde { data: { id, email, kind, nombre?, apellido?, matricula? } }
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<{ data: User }>('/auth/me');
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      // Se manda el refresh token para que la API también lo elimine
      const refreshToken = await storage.getRefreshToken();
      await apiClient.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.log('Error en logout:', error);
    }
  },
};
