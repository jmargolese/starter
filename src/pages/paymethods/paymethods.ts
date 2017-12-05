import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { PaymethodsProvider } from '../../share-common/providers/paymethods/paymethods';
import { PayPalProvider } from './../../share-common/providers/paypal/paypal';
import { UserProvider } from './../../share-common/providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

import * as shareTypes from '../../share-common/interfaces/interfaces';


@IonicPage()
@Component({
  selector: 'page-paymethods',
  templateUrl: 'paymethods.html',
})
export class PaymethodsPage {

  private paymethods: shareTypes.PayMethod[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider : UserProvider, 
     public analytics: AnalyticsProvider, public paymethodProvider: PaymethodsProvider, private popoverCtrl: PopoverController) {
  }

 newPaymethod(kind: string) {
    switch(kind){
      case 'stripe':
      // credit cards get added via the cloud for security reasons.
        this.navCtrl.push('AddStripeCcPage');
        break;
      case 'paypal':
        let email = this.userProvider.currentUser.profile.email;
        if (email == ""){ // Should never happen, for debugging
          email = '<unknown>';
        }

        this.paymethodProvider.addPaymethod(
          {
            vendor: 'paypal',
            isPreferred: true,
            kind: 'paypal',
            displayName: email,
            lastFour: 'NA',
            brand: "PayPal",
            hidden: false,
            sourceId: email
          });
        break;
    }

  }
// when the user clicks 'Add', we give them a choice of paymethod types.
  private showSelectPopover(event) {
    let pop = this.popoverCtrl.create('PaymethodChoicesPage',
      {}, { cssClass: 'paymethod-choice-popover' });

    pop.onDidDismiss(kind =>{
      this.newPaymethod(kind);
    });

    pop.present({
      ev: event
    });
  }

  ionViewDidEnter() {
    this.analytics.setCurrentScreen('paymethods');
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



}
