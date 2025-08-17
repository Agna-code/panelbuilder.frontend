import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from 'aws-amplify/auth';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Basic password policy check aligned with the pool's policy
    const meetsPolicy =
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password);
    if (!meetsPolicy) {
      setLoading(false);
      setError('Password must be at least 8 characters and include lowercase, uppercase, number and symbol.');
      return;
    }
    try {
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email, given_name: givenName, family_name: familyName } }
      });
      navigate(`/confirm?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '64px auto', padding: 24, border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <h2 style={{ marginBottom: 16 }}>Create account</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="givenName">First name</label>
          <input
            id="givenName"
            type="text"
            value={givenName}
            onChange={(e) => setGivenName(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="familyName">Last name</label>
          <input
            id="familyName"
            type="text"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            Must be 8+ chars and include lowercase, uppercase, number and symbol.
          </div>
        </div>
        {error && (
          <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>
        )}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        <span>Already have an account? </span>
        <Link to="/login">Sign in</Link>
      </div>
    </div>
  );
};

export default SignUp;


