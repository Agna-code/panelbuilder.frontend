import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { checking, isAuthenticated } = useAuth();

  if (checking) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;


