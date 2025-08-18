import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from 'aws-amplify/auth';
import { colors } from '../constants/colors';
import { LoadingButton } from '../common/LoadingButton';
import { FormField } from '../common/FormField';
import { PasswordInput } from '../common/PasswordInput';
import { FormContainer } from '../common/FormContainer';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn({ username: email, password });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
    } finally {
      setLoading(false);
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
            Welcome,
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
            Login to continue
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <FormContainer className="mb-8">
            <FormField
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="johndoe@gmail.com"
              required
            />
          </FormContainer>

          <FormContainer className="mb-8">
            <PasswordInput
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Password"
              required
              error={error || undefined}
            />
          </FormContainer>

          <LoadingButton
            type="submit"
            variant="primary"
            isLoading={loading}
            fullWidth
            height="47px"
            className="mb-20"
          >
            Login
          </LoadingButton>

          <LoadingButton
            variant="custom"
            fullWidth
            height="47px"
            className="mt-4"
            customButtonStyle={{
              background: 'transparent',
              border: `1.5px solid ${colors.primary.main}`,
              borderRadius: '4px',
              color: colors.primary.main,
              fontFamily: "'Work Sans', sans-serif",
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '19px',
            }}
          >
            New to ilumento? Learn more
          </LoadingButton>

          <div className="mt-6 text-center">
            <Link
              to="/forgot-password"
              style={{
                fontFamily: "'Work Sans', sans-serif",
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '19px',
                color: colors.primary.main,
                textDecoration: 'none',
              }}
            >
              Forgot password?
            </Link>
          </div>
        </form>

        <div className="mt-4 text-center">
          <span className="text-sm" style={{ color: colors.text.tertiary }}>New here? </span>
          <Link className="text-sm" to="/signup" style={{ color: colors.primary.main }}>Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;


