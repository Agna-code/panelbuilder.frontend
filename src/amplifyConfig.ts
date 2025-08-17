import { Amplify } from 'aws-amplify';

// Configure Amplify Auth (Cognito) using environment variables (CRA requires REACT_APP_ prefix)
const userPoolId = process.env.REACT_APP_COGNITO_USER_POOL_ID;
const userPoolClientId = process.env.REACT_APP_COGNITO_CLIENT_ID;

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: userPoolId!,
      userPoolClientId: userPoolClientId!,
      // Email-only sign-in per User Pool configuration
      loginWith: {
        email: true,
        username: false,
        phone: false
      }
    }
  }
});

export {};


