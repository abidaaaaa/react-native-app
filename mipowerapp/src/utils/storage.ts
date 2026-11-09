import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'user_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// expo-secure-store no funciona en web (ni durante el prerender), así que
// se usa localStorage como respaldo en esa plataforma.
const isWeb = Platform.OS === 'web';
const hasWindow = typeof window !== 'undefined';

const setItem = async (key: string, value: string): Promise<void> => {
  if (isWeb) {
    if (hasWindow) {
      localStorage.setItem(key, value);
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

const getItem = async (key: string): Promise<string | null> => {
  if (isWeb) {
    return hasWindow ? localStorage.getItem(key) : null;
  }
  return await SecureStore.getItemAsync(key);
};

const deleteItem = async (key: string): Promise<void> => {
  if (isWeb) {
    if (hasWindow) {
      localStorage.removeItem(key);
    }
    return;
  }
  await SecureStore.deleteItemAsync(key);
};

export const storage = {
  async saveToken(token: string): Promise<void> {
    try {
      await setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error guardando token:', error);
      throw new Error('No se pudo guardar el token');
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await deleteItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error eliminando token:', error);
    }
  },

  async saveRefreshToken(token: string): Promise<void> {
    try {
      await setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error guardando refresh token:', error);
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error obteniendo refresh token:', error);
      return null;
    }
  },

  async removeRefreshToken(): Promise<void> {
    try {
      await deleteItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error eliminando refresh token:', error);
    }
  },

  async clearAll(): Promise<void> {
    await Promise.all([
      this.removeToken(),
      this.removeRefreshToken(),
    ]);
  },
};
