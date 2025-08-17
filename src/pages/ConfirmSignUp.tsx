import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const ConfirmSignUp: React.FC = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const [email, setEmail] = useState(query.get('email') || '');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      navigate('/login');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Confirmation failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setError(null);
    setInfo(null);
    setResending(true);
    try {
      await resendSignUpCode({ username: email });
      setInfo('Verification code resent');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not resend code';
      setError(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '64px auto', padding: 24, border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <h2 style={{ marginBottom: 16 }}>Confirm your account</h2>
      <form onSubmit={onSubmit}>
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
          <label htmlFor="code">Verification Code</label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>
        {error && (
          <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>
        )}
        {info && (
          <div style={{ color: 'green', marginBottom: 12 }}>{info}</div>
        )}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
          {loading ? 'Confirming...' : 'Confirm'}
        </button>
      </form>
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onResend} disabled={resending || !email}>
          {resending ? 'Resending...' : 'Resend Code'}
        </button>
        <Link to="/login">Back to login</Link>
      </div>
    </div>
  );
};

export default ConfirmSignUp;


