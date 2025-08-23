import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

const ProtectedLayout: React.FC = () => {
  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await getCurrentUser();
        let displayName: string | undefined = user.username;
        try {
          const attrs = await fetchUserAttributes();
          const first = (attrs as any).given_name || (attrs as any).givenName || '';
          const last = (attrs as any).family_name || (attrs as any).familyName || '';
          const full = `${first} ${last}`.trim();
          if (full) displayName = full;
        } catch {}
        if (mounted) setUsername(displayName);
      } catch {
        if (mounted) setUsername(undefined);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar username={username} />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;


