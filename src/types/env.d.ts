/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_COGNITO_USER_POOL_ID?: string;
    readonly REACT_APP_COGNITO_USER_POOL_CLIENT_ID?: string;
  }
}


