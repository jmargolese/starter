//import { AddStripeCcPage } from './../../pages/add-stripe-cc/add-stripe-cc';

import { UserProvider } from './../user/user';
import { Injectable } from '@angular/core';
import {  Events } from 'ionic-angular'

import * as shareTypes from '../../interfaces/interfaces';

/*
  Generated class for the PaymethodsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PaymethodsProvider {

  private payMethods: shareTypes.PayMethod[];
  constructor(public userProvider: UserProvider, public events: Events) {
  
  }


  public getPaymethods(): shareTypes.PayMethod[] {
    this.payMethods = this.userProvider.getPaymethods();
    return this.payMethods;
  }

  public addPaymethod(paymethod): Promise<any> {

    this.getPaymethods();     // ensure up to date
    this.payMethods.push(paymethod);
    // make default will also update it to the DB
    return this.makeDefaultPaymethod(this.payMethods.length - 1);

  }

  public getPreferredPaymethod(required: boolean): Promise<any> {
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
        // need to launch the add paymethod as a modal
        // send a message to launch the modal:
        this.events.subscribe("modelDismissed:AddStripeCcPage", (result => {
          if (result.canceled) {
            var error: any = new Error('User canceled');
            error.canceled = true;
            reject(error);
          } else {
            resolve(result.data);
          }
        }));

        this.events.publish('model:AddStripeCcPage');
        
      /*  const addPayMethod = this.modalCtrl.create(AddStripeCcPage);
        addPayMethod.onDidDismiss(data => {
          if (data.canceled) {
            var error: any = new Error('User canceled');
            error.canceled = true;
            reject(error);
          } else
            resolve(data.newPaymethod);  // it'll be the first one, the only one that should exist now
        });
        addPayMethod.present();
        */
      }


    })

  }


  public deletePaymethod(index: number) {
    this.getPaymethods();      // refresh just to be sure
    if (index < this.payMethods.length) {

      let findNewPreferred: boolean = this.payMethods[index].isPreferred;

      this.payMethods.splice(index, 1);
      if (findNewPreferred && this.payMethods.length) {
        this.makeDefaultPaymethod(0);               // just make the first one default (this calls updatePaymethods for us)
      } else
        this.userProvider.updatePaymethods(this.payMethods);
    }
    else
      console.log("delete paymethod called with illegal index: " + index);
  }


  public makeDefaultPaymethod(index: number): Promise<any> {

    // don't refresh -- getPaymethods will call userProvider.getPaymethods() which may not be update to date if we are adding one
    //this.getPaymethods();      // refresh just to be sure  <- don't make this call, it causes 'this' to become undefined for some reason

    return new Promise((resolve, reject) => {
      let that = this;
     
    
    let len: number = that.payMethods.length;

     
      if (index < len) {


        for (let i = 0; i < that.payMethods.length; i++) {
          that.payMethods[i].isPreferred = (i == index ? true : false);
        }
        that.userProvider.updatePaymethods(that.payMethods)
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
