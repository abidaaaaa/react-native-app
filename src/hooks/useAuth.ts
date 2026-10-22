import { useState, useCallback } from 'react';
import { LoginCredentials, RegisterData } from '../types/auth';
import { ApiError, ErrorType } from '../types/errors';
import { authApi } from '../api/auth.api';
import { storage } from '../utils/storage';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  clearProfile,
  setProfile,
  toProfileData,
  type ProfileData,
} from '../store/profileSlice';

interface UseAuthReturn {
  user: ProfileData | null;
  loading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const toApiError = (err: unknown, fallback: string): ApiError =>
  err instanceof ApiError ? err : new ApiError(ErrorType.UNKNOWN, fallback);

export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();

  // El usuario vive en Redux (compartido por todas las pantallas),
  // lo único que se guarda en el dispositivo es el token.
  const user = useAppSelector((state) => state.profile.data);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Si hay token guardado, pide el perfil a la API y lo guarda en Redux
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const token = await storage.getToken();

      if (token) {
        const profile = await authApi.getProfile();
        dispatch(setProfile(toProfileData(profile)));
      } else {
        dispatch(clearProfile());
      }
    } catch (err) {
      console.error('Error verificando auth:', err);
      // Solo se borra el token si la API dijo que ya no sirve (no si solo falló la red)
      if (ApiError.isUnauthorized(err)) {
        await storage.clearAll();
      }
      dispatch(clearProfile());
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await authApi.login(credentials);

      await storage.saveToken(response.accessToken);
      if (response.refreshToken) {
        await storage.saveRefreshToken(response.refreshToken);
      }

      // Con el token se pide el perfil completo (nombre, apellido...) a /me
      const profile = await authApi.getProfile();
      dispatch(setProfile(toProfileData(profile)));
      return true;
    } catch (err) {
      await storage.clearAll();
      setError(toApiError(err, 'Error en login'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Crea al estudiante e inicia sesión
      const response = await authApi.register(data);

      await storage.saveToken(response.accessToken);
      if (response.refreshToken) {
        await storage.saveRefreshToken(response.refreshToken);
      }

      const profile = await authApi.getProfile();
      dispatch(setProfile(toProfileData(profile)));
      return true;
    } catch (err) {
      await storage.clearAll();
      setError(toApiError(err, 'Error en registro'));
      return false;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout(); // revoca el token en la API
    } catch (err) {
      console.log('Error en logout:', err);
    } finally {
      await storage.clearAll();
      dispatch(clearProfile());
    }
  }, [dispatch]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    checkAuth,
    clearError,
  };
};
