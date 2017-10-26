

import { FirebaseDynamicLinks }  from '@ionic-native/firebase-dynamic-links';
import { Deeplinks } from '@ionic-native/deeplinks';
import { Stripe } from '@ionic-native/stripe';

import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Share } from './app.component';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppVersion } from '@ionic-native/app-version';
import {InAppBrowser} from '@ionic-native/in-app-browser';


import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { ENV } from '@app/env';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthProvider } from '../providers/auth/auth';
import { DataProvider } from '../providers/data/data';
import { OrganizationProvider } from '../providers/organization/organization';
import { UserProvider } from '../providers/user/user';
import { ActivitiesProvider } from '../providers/activities/activities';


import { SocialSharing } from '@ionic-native/social-sharing';
import { PaymethodsProvider } from '../providers/paymethods/paymethods';
import { ShareProvider } from '../providers/share/share';
import { AlertProvider } from '../providers/alert/alert';

import { SentryErrorHandler} from '../services/sentry-errorhandler';


@NgModule({
  declarations: [
    Share,
    

    // components
    
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(ENV.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    IonicModule.forRoot(Share)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Share,
  
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: SentryErrorHandler},
    AuthProvider,
    DataProvider,
    OrganizationProvider,
    UserProvider,
    ActivitiesProvider,
    SocialSharing,
    AppVersion,
    PaymethodsProvider,
    ShareProvider,
    AlertProvider,
    InAppBrowser,
    FirebaseDynamicLinks,
    Deeplinks,
    Stripe
  ]
})
export class AppModule {}
