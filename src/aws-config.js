export const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_USER_POOL_ID,
      userPoolClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
      identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
      loginWith: {
        email: true
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true
        },
        name: {
          required: true
        }
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true
      }
    }
  }
};

export const lexConfig = {
  botId: process.env.REACT_APP_LEX_BOT_ID,
  botAliasId: process.env.REACT_APP_LEX_BOT_ALIAS_ID,
  localeId: 'en_US',
  region: process.env.REACT_APP_LEX_REGION || 'us-east-1'
};