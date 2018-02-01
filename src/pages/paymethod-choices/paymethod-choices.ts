import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import {  ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-paymethod-choices',
  templateUrl: 'paymethod-choices.html',
})
export class PaymethodChoicesPage {

  choices: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
  	platform: Platform) {
    this.choices = navParams.get('paymethodChoices');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymethodChoicesPage');
  }

  private dismiss(kind){
    this.viewCtrl.dismiss(kind);
  }

}
