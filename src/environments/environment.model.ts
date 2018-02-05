import { Environment } from './environment.model';
export interface Environment {
  mode: envMode;
  release: string;
  type: envType;
  debug: {
    profiling: boolean;
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
      secret: string;
      payerId: string;
      BNCode: string;
      accessToken: string;
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

