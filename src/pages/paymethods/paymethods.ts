import { PaymethodsProvider } from './../../share-common-providers/paymethods/paymethods';
import { UserProvider } from './../../share-common-providers/user/user';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider : UserProvider, public paymethodProvider: PaymethodsProvider) {
      
    
  }

  ionViewWillEnter() {
    this.paymethods = this.userProvider.getPaymethods();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymethodsPage');
  }

  public deletePaymethod(index : number) {
    console.log("Called delete paymethod in paymethod page");
    this.paymethodProvider.deletePaymethod(index);
   
  }

  public makeDefaultPaymethod(index: number) {
    this.paymethodProvider.makeDefaultPaymethod(index)
    .then(() => {
      this.paymethods = this.userProvider.getPaymethods();
    })
    
  }

  public addPaymethod() {
    this.navCtrl.push('AddStripeCcPage');
  }

}
