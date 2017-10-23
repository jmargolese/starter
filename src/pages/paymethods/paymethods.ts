import { AddStripeCcPage } from './../add-stripe-cc/add-stripe-cc';
import { PaymethodsProvider } from './../../providers/paymethods/paymethods';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import * as shareTypes from '../../interfaces/interfaces';


@IonicPage()
@Component({
  selector: 'page-paymethods',
  templateUrl: 'paymethods.html',
})
export class PaymethodsPage {

  public paymethods: shareTypes.PayMethod[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider : UserProvider, public payMethodProvider: PaymethodsProvider) {
      
    this.paymethods = userProvider.getPaymethods();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymethodsPage');
  }

  public deletePaymethod(paymethod) {
    console.log("Called delete paymethod");
  }

  public makeDefaultPaymethod(index: number) {
    this.payMethodProvider.makeDefaultPaymethod(index)
    .then(() => {
      this.paymethods = this.userProvider.getPaymethods();
    })
    
  }

  public addPaymethod() {
    this.navCtrl.push(AddStripeCcPage);
  }

}
