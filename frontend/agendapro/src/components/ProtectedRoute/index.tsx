import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('expires_in');
    
    if (!token || !expiresAt) {
      return false;
    }
    
    // Verifica se o token expirou
    const now = new Date().getTime();
    const expiration = parseInt(expiresAt);
    
    if (now >= expiration) {
      // Token expirado, remove do localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('expires_in');
      return false;
    }
    
    return true;
  };

  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;