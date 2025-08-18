import React, { useMemo, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { colors } from '../constants/colors';
import { FormContainer } from '../common/FormContainer';
import { FormField } from '../common/FormField';
import { LoadingButton } from '../common/LoadingButton';

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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-xl px-6 relative">
        <div className="mb-10">
          <h1
            style={{
              fontFamily: "'Work Sans', sans-serif",
              fontWeight: 700,
              fontSize: '32px',
              lineHeight: '38px',
              color: colors.text.primary,
            }}
          >
            Confirm your account
          </h1>
          <p
            style={{
              fontFamily: "'Work Sans', sans-serif",
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '19px',
              color: colors.text.secondary,
            }}
          >
            Enter the code sent to your email
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <FormContainer className="mb-6">
            <FormField
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="johndoe@gmail.com"
              required
            />
          </FormContainer>

          <FormContainer className="mb-2">
            <FormField
              label="Verification Code"
              type="text"
              value={code}
              onChange={setCode}
              placeholder="123456"
              required
            />
          </FormContainer>

          {error && (
            <div style={{ color: colors.status.error.main }} className="mb-2">{error}</div>
          )}
          {info && (
            <div style={{ color: colors.status.success.main }} className="mb-2">{info}</div>
          )}

          <LoadingButton
            type="submit"
            variant="primary"
            isLoading={loading}
            fullWidth
            height="47px"
            className="mb-6"
          >
            Confirm
          </LoadingButton>
        </form>

        <div className="mt-2 flex items-center justify-between">
          <LoadingButton
            onClick={onResend}
            disabled={resending || !email}
            isLoading={resending}
            loadingText="Resending..."
            variant="custom"
            customButtonStyle={{
              background: 'transparent',
              border: `1.5px solid ${colors.primary.main}`,
              borderRadius: '4px',
              color: colors.primary.main,
              padding: '8px 16px',
            }}
          >
            Resend Code
          </LoadingButton>
          <Link to="/login" style={{ color: colors.primary.main }}>Back to login</Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSignUp;


