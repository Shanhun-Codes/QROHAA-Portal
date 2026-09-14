import { PassedInitialConfig } from 'angular-auth-oidc-client';
import { ButtonConfig } from '../shared/components/button/button.config';

export const authConfig: PassedInitialConfig = {
  config: {
    authority:
      'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_KeUrBrdKN',

    redirectUrl: window.location.origin,
    postLogoutRedirectUri: window.location.origin,

    clientId: '27aqgqq5fiqak5bubmql7nifdu',

    scope: 'openid profile email',

    responseType: 'code',

    silentRenew: true,
    useRefreshToken: true,

    renewTimeBeforeTokenExpiresInSeconds: 30,
  },
};

export const LOGIN_BUTTON_CONFIG: ButtonConfig = {
  variant: 'primary',
  label: 'Log In',
};
