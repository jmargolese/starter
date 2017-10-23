
import { AddStripeCcPage } from './../pages/add-stripe-cc/add-stripe-cc';
import { PaymethodsPage } from './../pages/paymethods/paymethods';
import { LoginPage } from './../pages/login/login';
import { DashboardPage } from './../pages/dashboard/dashboard';
import { SettingsPasscodePage } from './../pages/settings-passcode/settings-passcode';
import { SettingsProfilePage } from './../pages/settings-profile/settings-profile';
import { SettingsPage } from './../pages/settings/settings';
import { OrgHomeComponent } from './../components/org-home/org-home';
import { ActionsBarComponent } from './../components/actions-bar/actions-bar';
import { ActionButtonComponent } from './../components/action-button/action-button';
import { OrgHomeItemComponent } from './../components/org-home-item/org-home-item';


import { OrgHomePage } from './../pages/org-home/org-home';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Share } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { BrowsePage } from '../pages/browse/browse';
import { TabsPage } from '../pages/tabs/tabs';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppVersion } from '@ionic-native/app-version';
import {InAppBrowser} from '@ionic-native/in-app-browser';


import { HomeListOrganizationComponent} from '../components/home-list-organization/home-list-organization';

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


@NgModule({
  declarations: [
    Share,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    BrowsePage,
    OrgHomePage,
    SettingsPage,
    SettingsProfilePage,
    SettingsPasscodePage,
    DashboardPage,
    LoginPage,
    PaymethodsPage,
    AddStripeCcPage,

    // components
    HomeListOrganizationComponent,
    OrgHomeItemComponent,
    ActionButtonComponent,
    ActionsBarComponent,
    OrgHomeComponent
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
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    BrowsePage,
    OrgHomePage,
    SettingsPage,
    SettingsProfilePage,
    SettingsPasscodePage,
    DashboardPage,
    LoginPage,
    PaymethodsPage,
    AddStripeCcPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
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
    InAppBrowser
  ]
})
export class AppModule {}
