import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Events, ViewController } from 'ionic-angular';

/**
 * Generated class for the PaymethodChoicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paymethod-choices',
  templateUrl: 'paymethod-choices.html',
})
export class PaymethodChoicesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
  	platform: Platform) {
  }

  public addPaymethod(kind){
  	this.viewCtrl.dismiss(kind);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymethodChoicesPage');
  }

}
