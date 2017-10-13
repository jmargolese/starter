import { DataProvider } from './../data/data';

import { Injectable } from '@angular/core';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';
//import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';


import * as firebase from 'firebase/app';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  currentAuthUser: firebase.User = null;
  currentUserInfo = null;

  public organizationLikes = [];

  constructor(public db: DataProvider) {
    console.log('Hello UserProvider Provider');
  }

  public updateUserInfo(authUser: firebase.User) {
    this.currentAuthUser = authUser;
    if (authUser) {       // null if logged out
      return this.db.getDocument('users', authUser.uid)
        .subscribe(userInfo => {
          this.currentUserInfo = userInfo;
        }, error => {
          console.error("In userProvider updatingUserINfo for uid: " + authUser.uid + ": " + error.message);
        })
    } else {
      this.currentUserInfo = null;
    }
  }

  public getUserInfo(uid) {

  }

  public toggleAddToHome(orgId) {

    var orgFavorites = this.currentUserInfo.organizationFavorites || {};

    // toggle
    if (orgFavorites.hasOwnProperty(orgId))
      delete orgFavorites[orgId];
    else
      orgFavorites[orgId] = true;

      this.currentUserInfo.organizationFavorites = orgFavorites;

    this.db.updateDocument('users', this.currentAuthUser.uid, this.currentUserInfo)
  }

  public getFavoriteOrganizations(): Observable<any> {
    this.organizationLikes = [];   // reset before we work

    if (this.currentUserInfo && this.currentUserInfo.organizationFavorites) {
      // or try .getOwnPropertyNames

      Object.keys(this.currentUserInfo.organizationFavorites).forEach(orgLike => {
        this.db.getDocument('organizations', orgLike)
          .subscribe(org => {
            this.organizationLikes.push(org);
          }, error => {
            console.error("Error retrieving document in userProvider:getOrganizationFavorties for key: '" + orgLike + "': " + error.message);
          })
      })

    }

    // https://stackoverflow.com/questions/41806188/how-to-create-an-observable-in-angular-2
    return Observable.of(this.organizationLikes);
  }

}
