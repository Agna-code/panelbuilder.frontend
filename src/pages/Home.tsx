import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const onSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{ maxWidth: 720, margin: '64px auto', padding: 24 }}>
      <h2>Welcome</h2>
      <p>You are signed in.</p>
      <button onClick={onSignOut} style={{ marginTop: 16 }}>Sign out</button>
    </div>
  );
};

export default Home;


