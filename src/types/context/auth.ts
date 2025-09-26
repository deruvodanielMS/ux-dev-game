import type { ReactNode } from 'react';

export interface AuthUser {
  id: string;
  email?: string | null;
  name?: string | null;
  picture?: string | null;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  token: string | null;
  getToken: () => Promise<string | null>;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
