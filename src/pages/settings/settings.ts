import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { ToastController, Events } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { ENV } from '@app/env';




/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  constructor(public platform: Platform, public navCtrl: NavController, public modalCtrl: ModalController,
    public navParams: NavParams, public auth: AuthProvider, public toastCtrl: ToastController, public appVersion: AppVersion,
    public events: Events) {
    if (platform.is('cordova')) {
      this.appVersion.getAppName().then(appName => this.appName = appName);
      this.appVersion.getPackageName().then(packageName => this.packageName = packageName);
      this.appVersion.getVersionCode().then(versionCode => this.versionCode = versionCode);
      this.appVersion.getVersionNumber().then(versionNumber => this.versionNumber = versionNumber);
    } else {
      this.versionCode = "Browser";
    }
  }

  public settingsCallback(action) {
    // general callback available to settings buttons
    switch (action) {
      case 'logout':
        this.auth.logout()
          .then(() => {
            this.events.publish('tabs:select', 1);      // switch to the Browse Tab
          })

        break;
      case 'login':
        const loginModal = this.modalCtrl.create('LoginPage');
        loginModal.onDidDismiss(data => {
          if (!data.canceled)
            this.events.publish('tabs:select', 0);      // switch to the Home Tab
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
        //tutorial();
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
    if (ENV.mode.toLowerCase() != 'production')
      entries.push({
        'title': 'Environment: ' + ENV.mode,
        'textOnly': true,
      });
    entries.push(
      {
        'title': 'View tutorial',
        'callback': 'tutorial',
      }
    )
    this.config.push({
      'sectionTitle': 'About',
      'entries': entries,
    })
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
  public ionViewWillEnter() {

    this.config = [];

    this.setAccountInfo();
    this.setEnvInfo();


  }
  public ionViewDidLoad(): void {
    console.log('ionViewDidLoad Page4Page');
  }

  public presentToast(message: string): void {
    let toast: any = this.toastCtrl.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }

}
