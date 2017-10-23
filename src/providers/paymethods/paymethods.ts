import { UserProvider } from './../user/user';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';


import 'rxjs/add/operator/map';

import * as shareTypes from '../../interfaces/interfaces';

/*
  Generated class for the PaymethodsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PaymethodsProvider {

  private payMethods: shareTypes.PayMethod[];
  constructor(public userProvider: UserProvider) {
    console.log('Hello PaymethodsProvider Provider');
  }


  public getPaymethods(): shareTypes.PayMethod[] {
    this.payMethods = this.userProvider.getPaymethods();
    return this.payMethods;
  }

  public getPreferredPaymethod(required: boolean) : Promise<any> {
    // TODO if required is true, this will ask the user for a paymethod if none exist
    this.getPaymethods();       // ensure up to date
    let preferred = null;

    return new Promise((resolve, reject) => {
      if (this.payMethods && this.payMethods.length) {
        this.payMethods[0];      // make sure we always return something
        for (let i = 0; i < this.payMethods.length; i++) {
          if (this.payMethods[i].isPreferred) {
            preferred = this.payMethods[i];
            break;
          }
        }
        resolve(preferred);
      } else {
        console.error("getPreferredPaymethod needs to call addPaymethod when it's implemented");
        reject(new Error("getPreferredPaymethod needs to call addPaymethod when it's implemented"));
      }


    })

  }

  public deletePaymethod(index: number) {
    this.getPaymethods();      // refresh just to be sure
    if (index < this.payMethods.length) {

      this.payMethods.splice(index, 1);
      this.userProvider.updatePaymethods(this.payMethods);
    }
    else
      console.log("delete paymethod called with illegal index: " + index);
  }


  public makeDefaultPaymethod(index: number) {

    return new Promise((resolve, reject) => {
      this.getPaymethods();      // refresh just to be sure
      if (index < this.payMethods.length) {


        for (let i = 0; i < this.payMethods.length; i++) {
          this.payMethods[i].isPreferred = (i == index ? true : false);
        }
        this.userProvider.updatePaymethods(this.payMethods)
          .then(() => {
            resolve();
          })
          .catch(error => {
            console.error("Error in paymethods provider makeDefaultPayment: " + error.message);
            reject(error);
          })
      }
      else {
        console.log("makeDefaultPaymethod  called with illegal index: " + index);
        reject(new Error('makeDefaultPaymethod  called with illegal index: ' + index));
      }
    });

  }



}
