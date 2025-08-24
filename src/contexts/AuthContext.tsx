import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Hub } from 'aws-amplify/utils';
import { fetchAuthSession, getCurrentUser, signOut } from 'aws-amplify/auth';

interface AuthUser {
  username: string;
  userId?: string;
}

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  checking: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const evaluateAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await fetchAuthSession();
      const isAuthed = !!session.tokens?.idToken;
      if (isAuthed) {
        const cu = await getCurrentUser();
        setUser({ username: cu.username, userId: cu.userId });
      } else {
        setUser(null);
      }
      setIsAuthenticated(isAuthed);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setChecking(true);
    try {
      await evaluateAuth();
    } finally {
      setChecking(false);
    }
  }, [evaluateAuth]);

  const logout = useCallback(async () => {
    try {
      await signOut();
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await refresh();
    })();

    const sub = Hub.listen('auth', async () => {
      if (!mounted) return;
      await refresh();
    });

    return () => {
      mounted = false;
      sub();
    };
  }, [refresh]);

  const value = useMemo<AuthContextType>(() => ({
    isLoading,
    isAuthenticated,
    user,
    checking,
    refresh,
    logout,
  }), [isAuthenticated, user, checking, refresh, logout, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};


