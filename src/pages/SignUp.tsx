import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from 'aws-amplify/auth';
import { colors } from '../constants/colors';
import { FormContainer } from '../common/FormContainer';
import { FormField } from '../common/FormField';
import { PasswordInput } from '../common/PasswordInput';
import { LoadingButton } from '../common/LoadingButton';

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
            Create account
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
            Sign up to continue
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <FormContainer className="mb-6">
            <FormField
              label="First name"
              type="text"
              value={givenName}
              onChange={setGivenName}
              placeholder="John"
              required
            />
          </FormContainer>

          <FormContainer className="mb-6">
            <FormField
              label="Last name"
              type="text"
              value={familyName}
              onChange={setFamilyName}
              placeholder="Doe"
              required
            />
          </FormContainer>

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
            <PasswordInput
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="Password"
              required
              error={error || undefined}
            />
          </FormContainer>
          <div style={{ fontSize: 12, color: colors.text.tertiary, fontFamily: "'Work Sans', sans-serif" }} className="mb-6">
            Must be 8+ chars and include lowercase, uppercase, number and symbol.
          </div>

          <LoadingButton
            type="submit"
            variant="primary"
            isLoading={loading}
            fullWidth
            height="47px"
            className="mb-6"
          >
            Sign Up
          </LoadingButton>

          <div className="mt-2 text-center">
            <span className="text-sm" style={{ color: colors.text.tertiary }}>Already have an account? </span>
            <Link className="text-sm" to="/login" style={{ color: colors.primary.main }}>Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;


