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
          console.log("About to write error in user.ts updateUserInfo");
          console.error("In userProvider updatingUserINfo for uid: " + authUser.uid + ": " + error.message);
        })
    } else {
      this.currentUserInfo = null;
    }
  }

  public getUserInfo() {
    return this.currentUserInfo;
  }

  
  public isUserFavorite(type, id) {
    let retVal = false;

    if (this.currentUserInfo) {
      if (this.currentUserInfo.favorites) {
        let toTest = type == 'activities' ? (this.currentUserInfo.favorites.activities || {}) : (this.currentUserInfo.favorites.organizations || {});

        retVal = toTest.hasOwnProperty(id) ? true : false;
      }
    }

    return retVal;
  }
  

  public toggleAddToHome(orgId) {

    var favorites = this.currentUserInfo.favorites || {};

    var orgFavorites = favorites.organizations || {};

    // toggle
    if (orgFavorites.hasOwnProperty(orgId))
      delete orgFavorites[orgId];
    else
      orgFavorites[orgId] = true;

    this.currentUserInfo.favorites.organizations = orgFavorites;

    this.db.updateDocument('users', this.currentAuthUser.uid, this.currentUserInfo)
  }

  public toggleFavoriteActivity(id) {

    if (!this.currentUserInfo.favorites)
      this.currentUserInfo.favorites = {};

    var favorites = this.currentUserInfo.favorites || {};

    var activityFavorites = favorites.activities || {};

    // toggle
    if (activityFavorites.hasOwnProperty(id))
      delete activityFavorites[id];
    else
      activityFavorites[id] = true;

    this.currentUserInfo.favorites.activities = activityFavorites;

    this.db.updateDocument('users', this.currentAuthUser.uid, this.currentUserInfo)
  }

  public getFavoriteOrganizations(): Observable<any> {
    this.organizationLikes = [];   // reset before we work

    if (this.currentUserInfo && this.currentUserInfo.favorites && this.currentUserInfo.favorites.organizations) {
      // or try .getOwnPropertyNames

      Object.keys(this.currentUserInfo.favorites.organizations).forEach(orgLike => {
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
