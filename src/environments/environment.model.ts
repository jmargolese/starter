export interface Environment {
  mode: string;
  release: string;

  firebase: {
      apiKey: string;
      authDomain: string;
      databaseURL: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
      cloudFunctionUrl: string;
      shareWebBaseUrl: string;
  },
  stripe: {
    privateKey: string;
    clientId: string;
  },
  paypal: {
    baseUrl: string;
    clientId: string;
    secret: string;
    payerId: string;
    BNCode: string;
    accessToken: string;
  },
  raven: {
    appKey: string;
  }
}
