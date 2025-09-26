import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import type {
  AuthContextValue,
  AuthProviderProps,
  AuthUser,
} from '@/types/context/auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const {
    user: rawUser,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    logout: auth0Logout,
  } = useAuth0();

  const [token, setToken] = useState<string | null>(null);

  const mapUser = (u: typeof rawUser): AuthUser | null => {
    if (!u) return null;
    const id = (u as { sub?: string } | null)?.sub ?? 'unknown';
    const picture = (u as { picture?: string } | null)?.picture ?? null;
    return {
      id,
      email: u.email,
      name: u.name,
      picture,
    };
  };

  const fetchToken = useCallback(async () => {
    try {
      const t = await getAccessTokenSilently();
      setToken(t || null);
      return t || null;
    } catch {
      setToken(null);
      return null;
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchToken();
    } else {
      setToken(null);
    }
  }, [isAuthenticated, fetchToken]);

  const logout = useCallback(async () => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  }, [auth0Logout]);

  const value: AuthContextValue = {
    user: mapUser(rawUser),
    isAuthenticated: !!isAuthenticated,
    loading: isLoading,
    token,
    getToken: fetchToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
