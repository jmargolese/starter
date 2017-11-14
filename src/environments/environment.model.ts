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
  },
  stripe: {
    privateKey: string;
  },
  raven : {
    appKey: string;
  },
  addStripeSourceUrl : string,
  devStripeSourceUrl : string
}
