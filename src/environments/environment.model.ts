export interface Environment {
  mode: string;
  release: string;
  app: {
    minDonation: number,
    maxDonation: number
  },
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
  raven: {
    appKey: string;
  }
}
