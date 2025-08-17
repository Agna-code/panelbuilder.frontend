import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from 'aws-amplify/auth';

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await getCurrentUser();
        if (mounted) setIsAuthed(true);
      } catch {
        if (mounted) setIsAuthed(false);
      } finally {
        if (mounted) setChecking(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (checking) return null;
  if (!isAuthed) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;


