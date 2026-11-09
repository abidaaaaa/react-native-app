/**
 * Context para manejo global de autenticación
 *
 * ERROR #14: Re-renders innecesarios en el contexto
 * Problema: el objeto `value` se creaba en cada render, y todos los
 * componentes que usan el contexto se re-renderizaban aunque no cambiara nada.
 * Solución: useMemo en el `value` y useCallback en las funciones.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { User, LoginCredentials } from '../types/auth';
import { ApiError, ErrorType } from '../types/errors';
import { authApi } from '../api/auth.api';
import { storage } from '../utils/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const isAuthenticated = !!user;

  const checkAuth = useCallback(async () => {
    try {
      const token = await storage.getToken();
      if (!token) {
        setUser(null);
        return;
      }

      setLoading(true);
      const currentUser = await authApi.getProfile();
      setUser(currentUser);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login(credentials);

      await storage.saveToken(response.accessToken);
      if (response.refreshToken) {
        await storage.saveRefreshToken(response.refreshToken);
      }

      setUser(response.user);
      return true;
    } catch (err) {
      const apiError =
        err instanceof ApiError ? err : new ApiError(ErrorType.UNKNOWN, 'Error en login');
      setError(apiError);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignorar errores
    } finally {
      await storage.clearAll();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ERROR #14: value memoizado, solo cambia si cambia alguna de sus dependencias
  const value = useMemo<AuthContextType>(
    () => ({ user, loading, error, isAuthenticated, login, logout }),
    [user, loading, error, isAuthenticated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}