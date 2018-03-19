import { AlertProvider } from './../../share-common/providers/alert/alert';
import { UserProvider } from './../../share-common/providers/user/user';
import { envMode } from './../../environments/environment.model';
import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { AuthProvider } from '../../share-common/providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { ToastController, Events } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { ENV } from '@app/env';
import * as constants from '../../share-common/config/constants';



@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  public config: any;

  public appName: string = "";
  public packageName: string = "";
  public versionCode: string = "";
  public versionNumber: string = "";

  constructor(public platform: Platform, public navCtrl: NavController, public modalCtrl: ModalController, public analytics: AnalyticsProvider,
    public navParams: NavParams, public auth: AuthProvider, public toastCtrl: ToastController, public appVersion: AppVersion,
    public events: Events, private userProvider: UserProvider, private alert: AlertProvider) {
    if (platform.is('cordova')) {
      this.appVersion.getAppName().then(appName => this.appName = appName);
      this.appVersion.getPackageName().then(packageName => this.packageName = packageName);
      this.appVersion.getVersionCode().then(versionCode => this.versionCode = versionCode);
      this.appVersion.getVersionNumber().then(versionNumber => this.versionNumber = versionNumber);
    } else {
      this.versionCode = "Browser";
    }
  }

  ionViewDidEnter() {
    this.analytics.setCurrentScreen('Settings');
  }

  public settingsCallback(action) {
    // general callback available to settings buttons
    switch (action) {
      case 'logout':
        this.userProvider.logout()
          .then(() => {
            this.events.publish(constants.EventTypes.loginStateChange, constants.authStateChange.logout);      // switch to the Browse Tab
          })
          .catch(error => {
            console.error(`Error calling logout in Settings: ${error.message}`);
          })

        break;
      case 'login':
        const loginModal = this.modalCtrl.create('LoginPage');
        loginModal.onDidDismiss(data => {
          if (data && !data.canceled)
            this.events.publish(constants.EventTypes.loginStateChange, constants.authStateChange.login);      // switch to the Home Tab
        });
        loginModal.present();
        break;
      case 'profile':
        this.navCtrl.push('SettingsProfilePage');
        break;
      case 'paymethods':
        this.navCtrl.push('PaymethodsPage');
        break;
      case 'tutorial':
      
        const introModal = this.modalCtrl.create('IntroPage', {userRequested: true});

        introModal.present();
    
      
        break;

        case 'aboutus':
        this.alert.confirm({title: "About Us", message: "iPayMyWay develops apps for non-profits.<br> We created and donated this app, pro-bono, to support events, marches and protests such as the March For Our Lives movement.<br> Your privacy and personal information are protected and won't be shared. <br><br> Thank you for being part of this great event", buttons: {ok: true, cancel: false}});
        break;
      case 'debug':
        this.navCtrl.push("ContactPage");
        break;
      default:

    }
  }

  private setEnvInfo() {
    var entries = [];
    entries.push({
      'title': 'Version: ' + this.versionCode,
      'textOnly': true,
    })
    // we don't tell end-users that it's 'production'
    if (ENV.mode != envMode.production)
      entries.push({
        'title': 'Environment: ' + ENV.mode,
        'textOnly': true,
      });

   /*  entries.push(
      {
        'title': 'View tutorial',
        'callback': 'tutorial',
      }
    ) */
    this.config.push({
      'sectionTitle': 'About',
      'entries': entries,
    })
  }

  private setAdminOptions() {
    // only displayed in dev and for admins  
    let entries = [];

    // show debug if not production, but always show on browser
    if (ENV.mode != envMode.production ||  !this.platform.is('cordova')) {
      entries.push(
        {
          title: 'Debug',
          callback: 'debug'
        }
      );

      this.config.push({
        'sectionTitle': 'Admin',
        'entries': entries
      });
    }
  }

  private setAccountInfo() {

    let entries = [];

    if (this.auth.isAuthenticated()) {
      entries.push(
        {
          title: 'Profile',
          callback: 'profile' 
        },
         {
          title: 'Payment Methods',
          callback: 'paymethods'
        }, 
        {
          title: "Sign-out",
          callbackNoArrow: 'logout'
        }

      );
    }
    else {
      entries.push(
        {
          'title': 'Sign-in/Sign-up',
          'callbackNoArrow': 'login',
        }
      )
    }

    this.config.push({
      'sectionTitle': 'Account',
      'entries': entries
    })
  }

  private setHelpInfo() {

    let entries = [];
 
   
      entries.push(
        {
          title: 'Show Tutorial',
          callback: 'tutorial'
        },
        {
          title: 'About Us',
          callback: 'aboutus'
        }

      );
    
    

    this.config.push({
      'sectionTitle': 'Help',
      'entries': entries
    })
  }
  public ionViewWillEnter() {

    this.config = [];
    this.setHelpInfo();
    this.setAccountInfo();
    this.setEnvInfo();
    this.setAdminOptions();


  }
  public ionViewDidLoad(): void {
    console.log('ionViewDidLoad Settings');
  }

  public presentToast(message: string): void {
    let toast: any = this.toastCtrl.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }

}
