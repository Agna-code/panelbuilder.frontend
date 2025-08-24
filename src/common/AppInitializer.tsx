import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useConfiguration } from '../contexts/ConfigurationContext';
import { CircularProgress } from './CircularProgress';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { isLoading: isAuthLoading } = useAuth();
  const { isLoading: isConfigLoading } = useConfiguration();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {

    // If all contexts have finished their initial load
    if (!isAuthLoading && !isConfigLoading) {
      setHasInitialized(true);
    }
  }, [isAuthLoading, isConfigLoading]);

  // Only show loading screen during initial load
  if (!hasInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <CircularProgress size="large" color="primary" />
          <h2 className="text-xl font-semibold text-gray-700">
            Initializing Application...
          </h2>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
