export interface User {
  id: number;
  email: string;
  kind?: 'user' | 'student';
  nombre?: string;
  apellido?: string;
  matricula?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  matricula: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

// Claims que lleva el JWT de la API (ver authService.ts del backend)
export interface TokenPayload {
  sub: string;
  email: string;
  kind: 'user' | 'student';
  jti: string;
  iat: number;
  exp: number;
}
