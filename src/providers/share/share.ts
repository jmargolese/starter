import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PayMethod } from './../../interfaces/interfaces.d';
import { OrganizationProvider } from './../organization/organization';
import { AlertProvider } from './../alert/alert';
import { UserProvider } from './../user/user';
import { URLSearchParams } from '@angular/http';
import { PaymethodsProvider } from './../paymethods/paymethods';
import { Injectable } from '@angular/core';
 

import * as shareTypes from '../../interfaces/interfaces';

@Injectable()
export class ShareProvider {

  constructor(public payMethods: PaymethodsProvider, public orgProvider: OrganizationProvider, public userProvider: UserProvider, 
      public alert: AlertProvider, public iab: InAppBrowser) {
    console.log('Hello ShareProvider Provider');
  }

  /**
   * Serializes the form element so it can be passed to the back end through the url.
   * The objects properties are the keys and the objects values are the values.
   * ex: { "a":1, "b":2, "c":3 } would look like ?a=1&b=2&c=3
   * @param  {SystemSetup} obj - The system setup to be url encoded
   * @returns URLSearchParams - The url encoded system setup
   */
  public serialize(obj: {}): URLSearchParams {
    //https://stackoverflow.com/questions/39858290/how-to-use-httpparamserializer-in-angular2
    let params: URLSearchParams = new URLSearchParams();

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var element = obj[key];

        params.set(key, element);
      }
    }
    return params;
  }
  public sendToWebsite(activity: {}, organization: shareTypes.Organization, payMethodType: string) {

    let params = {
      nocache: 1,
      api: "true",
      version: 1,
      action: "checkout",
      recipientDisplayName: organization.companyName,
      donorId: this.userProvider.getUserId(),
      recipientId: this.orgProvider.getId(organization),
      donationPrefs: organization.donationPrefs,
     // timeStamp: "Whats the timestamp?",                 // this is to keep the social share message in sync on the return, let's be more deterministic if we can
      isDemo: this.userProvider.isRoleDemo(),
      creditCardFee: this.orgProvider.getCreditCardFee(organization, payMethodType)

    }
    let serializedParams: URLSearchParams = this.serialize(params);
    //serialedParams.toString() to get the URL

    this.iab.create('http://google.com');
  }

  public donate(activity: {}, organization: shareTypes.Organization): Promise<any> {
    // we require a logged in user before calling us (Just to stay parallel with other button actions)

    return new Promise((resolve, reject) => {
      var payMethod: shareTypes.PayMethod = null;
      this.payMethods.getPreferredPaymethod(true)
        .then(preferred => {
          payMethod = preferred;
          // we got a logged in use and a paymethod, so lets send to the web let confirm = this.alertCtrl.create({
          this.alert.confirm({
            title: "Donate!",
            message: "We're going to open our secure web-server in a separate browser to complete this donation"
          })
            .then(() => {
              this.sendToWebsite(activity, organization, payMethod.vendor.toLowerCase());
            })
            .catch(error => {
              // user canceled, don't rejectd, that just forces our caller to handle it, really there's nothing to do
              if (!error.canceled) 
                 reject(error);
            })
        })
        .catch(error => {
          reject(error);
        })
    })
  }

}
