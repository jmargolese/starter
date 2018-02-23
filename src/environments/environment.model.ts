import { Environment } from './environment.model';
export interface Environment {
  app: envApp,     // what app are we?
  mode: envMode;
  release: string;
  type: envType,
  debug: {
    profiling: boolean
  },
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
    payerId: string;
    BNCode: string;
  },
  raven: {
    appKey: string;
    appKeyConsole: string;
  }
}

  
export enum envMode {
  production = "Production",
  dev = "Development",
  local = "Local"
}

export enum  envType {
  console = "console",
  app = "app"
}

export enum envApp {
  // What app are we
  unknown = "unknown",
  share = "share",
  MFOL = 'MarchForOurLives'
}

