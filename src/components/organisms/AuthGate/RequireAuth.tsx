import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';

interface RequireAuthProps {
  children: React.ReactElement;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ padding: '2rem' }}>Cargando...</div>;
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
};
