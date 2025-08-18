import React, { useEffect, useState } from 'react';
import ProjectDashboard from '../Projects/ProjectDashboard';
import Navbar from '../navbar/Navbar';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

const Home: React.FC = () => {
  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await getCurrentUser();
        let displayName: string | undefined = user.username;
        try {
          const attrs = await fetchUserAttributes();
          const first = attrs.given_name || attrs.givenName || '';
          const last = attrs.family_name || attrs.familyName || '';
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
        <ProjectDashboard />
      </div>
    </div>
  );
};

export default Home;


