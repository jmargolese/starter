import { UserProvider } from './../user/user';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';


import 'rxjs/add/operator/map';

/*
  Generated class for the PaymethodsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PaymethodsProvider {

  private payMethods;
  constructor(public userProvider: UserProvider) {
    console.log('Hello PaymethodsProvider Provider');
  }


  public getPaymethods() {
    this.payMethods = this.userProvider.getPaymethods();
    return this.payMethods;
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
