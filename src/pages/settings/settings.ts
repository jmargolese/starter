import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    this.config = [{
      'sectionTitle': 'Account',
      'entries': [
        {
          'title': 'Sign-in/Sign-up',
          'callback': 'login',
        },
      ],
    },
      {
        'sectionTitle': 'About',
        'entries': [
          {
            'title': 'Version: Browser',
            'textOnly': true,
          },
          {
            'title': 'Environment: sharedev',
            'textOnly': true,
          },
          {
            'title': 'View tutorial',
            'callback': 'tutorial',
          },
        ],
      }];

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
