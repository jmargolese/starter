import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { PaymethodsProvider } from '../../share-common/providers/paymethods/paymethods';
//import { PayPalProvider } from './../../share-common/providers/paypal/paypal';
import { UserProvider } from './../../share-common/providers/user/user';
import { AlertProvider } from './../../share-common/providers/alert/alert';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, LoadingController } from 'ionic-angular';

import * as shareTypes from '../../share-common/interfaces/interfaces';


@IonicPage()
@Component({
  selector: 'page-paymethods',
  templateUrl: 'paymethods.html',
})
export class PaymethodsPage {

  private paymethods: shareTypes.PayMethod[];
  private loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider,
    public analytics: AnalyticsProvider, public paymethodProvider: PaymethodsProvider, private popoverCtrl: PopoverController,
    private alert: AlertProvider, private loadingCtrl: LoadingController) {
  }

  // This is where we add new paymethod choices

  public paymethodChoices: shareTypes.paymethodChoices[] =
    [
      {
        kind: 'stripe',
        iconType: 'icon',
        imgUrl: '',
        description: 'Add credit card',
        canHaveMany: true
      },
      // {
      //   kind: 'paypal',
      //   iconType: 'image',
      //   imgUrl: './assets/img/ccIcons/paypal.png',
      //   description: 'Checkout with PayPal',
      //   canHaveMany: false
      // },

    ];

  private setPaymethodChoices(): any {
    let pmChoices: shareTypes.paymethodChoices[] = [];

    for (let choice of this.paymethodChoices) {
      if (choice.canHaveMany) {
        pmChoices.push(choice);
      } else {
        if (!this.paymethodProvider.hasPaymethod(choice.kind))
          pmChoices.push(choice);
      }
    }
    return (pmChoices != [] ? pmChoices : this.setPaymethodChoices);
  }

  private newPaymethod(kind: string) {
    this.paymethods = this.paymethodProvider.getPaymethods(); // refresh
    switch (kind) {
      case 'stripe':
        // credit cards get added via the cloud for security reasons.
        this.navCtrl.push('AddStripeCcPage');
        break;

      case 'paypal':
        let email = this.userProvider.currentUser.profile.email;
        if (email == "") { // Should never happen, for debugging
          email = '<unknown>';
        }

        this.paymethodProvider.addPaymethod(
          {
            vendor: 'paypal',
            isPreferred: true,
            kind: 'paypal',
            displayName: email,
            lastFour: null,
            brand: "PayPal",
            hidden: false,
            sourceId: email
          }).then(() => {
            this.paymethods = this.paymethodProvider.getPaymethods();
          });
        break;
    }

  }
  // when the user clicks 'Add', we give them a choice of paymethod types.
  // supports PayPal
  // private showSelectPopover(event) {
  //   let pop = this.popoverCtrl.create('PaymethodChoicesPage',
  //     {paymethodChoices: this.setPaymethodChoices()});

  //   pop.onDidDismiss(kind =>{
  //     if(kind){
  //       this.newPaymethod(kind);
  //     }
  //   });

  //   pop.present({
  //     ev: event
  //   });
  // }

  ionViewDidEnter() {
    this.analytics.setCurrentScreen('paymethods');
  }

  ionViewWillEnter() {
    // have to call this one which calls the userProvider one, but sets
    // up the paymethods variable in the paymethodsProvider.
    this.paymethods = this.paymethodProvider.getPaymethods();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymethodsPage');
  }

  public deletePaymethod(index: number) {
    this.alert.confirm({
      title: 'Delete', message: 'You are about to delete this payment method.',
      buttons: { ok: true, cancel: true }
    })
      .then(() => {
        console.log("Called delete paymethod in paymethod page");
        this.loading = this.loadingCtrl.create({ content: '' });
        this.loading.present()
          .then(() => {
            this.paymethodProvider.deletePaymethod(index)
              .then(() => {
                if (this.loading) { this.loading.dismiss().catch(); this.loading = null; }
                this.paymethods = this.paymethodProvider.getPaymethods(); //refresh
              })
              .catch(err => {
                if (this.loading) { this.loading.dismiss().catch(); this.loading = null; }
                this.alert.confirm({ title: 'An error occured.', message: 'there was a problem deleting this paymethod.', buttons: { ok: true } });
              });
          }).catch(error => { // changed their mind.
            return;
          })

      });
  }

  public makeDefaultPaymethod(index: number) {
    this.paymethodProvider.makeDefaultPaymethod(index)
      .then(() => {
        this.paymethods = this.paymethodProvider.getPaymethods();
      })

  }



}
