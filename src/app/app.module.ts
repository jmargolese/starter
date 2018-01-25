import { Deeplinks } from '@ionic-native/deeplinks';
import { Stripe } from '@ionic-native/stripe';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Share } from './app.component';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppVersion } from '@ionic-native/app-version';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics';
import { Facebook } from '@ionic-native/facebook';



import { AngularFireModule } from 'angularfire2';
import { ENV } from '@app/env';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthProvider } from '../share-common/providers/auth/auth';
import { DataProvider } from '../share-common/providers/data/data';
import { OrganizationProvider } from '../share-common/providers/organization/organization';
import { UserProvider } from '../share-common/providers/user/user';
import { ActivitiesProvider } from '../share-common/providers/activities/activities';
import { AnalyticsProvider } from '../share-common/providers/analytics/analytics';
import { StripeProvider } from '../share-common/providers/stripe/stripe';


import { SocialSharing } from '@ionic-native/social-sharing';
import { PaymethodsProvider } from '../share-common/providers/paymethods/paymethods';
import { ShareProvider } from '../share-common/providers/share/share';
import { AlertProvider } from '../share-common/providers/alert/alert';

//import { TestProvider } from '../../../common/src/modules/share-common/providers/test';
import { SentryErrorHandler} from '../services/sentry-errorhandler';
import { NotificationsProvider } from '../share-common/providers/notifications/notifications';
import { CloudFunctionProvider } from '../share-common/providers/cloud-function/cloud-function';
import { SocialShareProvider } from '../share-common/providers/social-share/social-share';
import { Push } from '@ionic-native/push';
import { ErrorReporterProvider } from '../share-common/providers/error-reporter/error-reporter';
import { FacebookProvider } from '../share-common/providers/facebook/facebook';


@NgModule({
  declarations: [
    Share
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireModule.initializeApp(ENV.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    IonicModule.forRoot(Share)
  ],
  bootstrap: [IonicApp],
  entryComponents: [

    Share
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
    AnalyticsProvider,
    InAppBrowser,
    FirebaseAnalytics,
    Deeplinks,
    Stripe,
    Push,
    NotificationsProvider,
    StripeProvider,
    CloudFunctionProvider,
    SocialShareProvider,
    ErrorReporterProvider,
    Facebook,
    FacebookProvider
  ]
})
export class AppModule {}