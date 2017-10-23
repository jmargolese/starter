
import { UserProvider } from './../user/user';
import { DataProvider } from './../data/data';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as shareTypes from "../../interfaces/interfaces"


/*
  Generated class for the OrganizationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrganizationProvider {

  private organizationsCollection: AngularFirestoreCollection<any>;
  public allOrganizations: Observable<any[]>;

  constructor(private db: DataProvider, public userProvider: UserProvider) {
    console.log('Hello OrganizationProvider Provider');

  }

  public getId(organization: shareTypes.Organization): string {
    if (organization && organization.id)
      return organization.id;
    else
      return "";
  }

  public getCreditCardFee(organization: shareTypes.Organization, type: string): number {
    // pass in the payment type and we can look it's associated rate
    var fee: number = 0;

    if (organization && organization.payMethods && organization.payMethods.length) {

      for (var i = 0; i < organization.payMethods.length; i++) {
        if (organization.payMethods[i].type == type) {
          switch (type) {
            case "stripe":
              var info: shareTypes.PayMethodInfoStripe = organization.payMethods[i].data;
              fee = info.creditCardFee;
              break;

            default:
              // throw an error to trigger raven
              try {
                throw new Error("organization:GetCreditCardFees called with invalid paymethod type: " + type);
              } catch (error) {
                console.error(error.message);
              }

              break;
          }

          break;
        }
      }
    }

    else {
      console.error("organization.getCreditCardFee called without an org or without any paymethods: " + JSON.stringify(organization));
      return 0;
    }

  }
  public getAllOrganizations(): Observable<any[]> {
    this.allOrganizations = this.db.getAllOrganizations(true);
    return this.allOrganizations;
  }



}
