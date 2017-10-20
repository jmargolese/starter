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

  // getters
  public getUserProfile() {
    if (!this.currentUserInfo)
      throw new Error('getUserProfile called with no logged in user');
    else
      return this.currentUserInfo.profile;

  }

  public getUserInfo() {
    return this.currentUserInfo;
  }

  public getUserId(): string {
    return this.currentAuthUser ? this.currentAuthUser.uid : ""
  }

  public userHasOrganization(): boolean {
    return this.currentUserInfo ? this.currentUserInfo.organization : false;
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

  public getFavoriteOrganizations(): any {
    this.organizationLikes = [];   // reset before we work


    if (this.currentUserInfo && this.currentUserInfo.favorites && this.currentUserInfo.favorites.organizations) {
      // or try .getOwnPropertyNames

      Object.keys(this.currentUserInfo.favorites.organizations).forEach(orgLike => {
        this.db.getDocument('organizations', orgLike)
          .subscribe(org => {
            org.id = orgLike;            // getDocument doesn't retrieve the id, but we happen to have it
            this.organizationLikes.push(org);
          }, error => {
            console.error("Error retrieving document in userProvider:getOrganizationFavorties for key: '" + orgLike + "': " + error.message);
          })
      })

    }

    // https://stackoverflow.com/questions/41806188/how-to-create-an-observable-in-angular-2
    return Observable.of(this.organizationLikes);


  }
  // end getters

  //setters

  /*key: "fred.ipmw+20@gmail.com",
  data: {
      "profile": {
          "name": {
              "first": "Fred",
              "last": "Flint20"
          },
          "phoneNumber": "555 555-1212"
      },
      "info": {
          "isDemo": false,
          "isAdmin": false,
          "isEnabled": true
      },
      "organization": "orgChadTough"
  }
  */
  public createNewUser(userInfo: {
    email: string,
    firstName: string,
    lastName: string
  }) {

    let userData = {
      "profile": {
        first: userInfo.firstName,
        last: userInfo.lastName
      },
      "info": {
        isDemo: false,
        isAdmin: false,
        isEnabled: false
      },
      organization: null
    }

    return new Promise((resolve, reject) => {
      this.db.createDocument('users', this.currentAuthUser.uid, userData)
        .then(() => {
          this.currentUserInfo.userData;
          resolve();
        })
        .catch(error => {
          console.log("Error creating new user in userProvider: " + error.message);
          reject(error);
        })
    })

  }
  public updateUserInfo(authUser: firebase.User): Promise<any> {
    // called by AuthProvider to keep us in sync with user Auth data
    this.currentAuthUser = authUser;

    return new Promise((resolve, reject) => {
      if (authUser) {       // null if logged out
        if (!this.currentUserInfo || (authUser.uid != this.currentUserInfo.uid))
          this.db.getDocument('users', authUser.uid)
            .subscribe(userInfo => {
              this.currentUserInfo = userInfo;
              resolve(this.currentUserInfo);
            }, error => {

              console.error("In userProvider updatingUserInfo for uid: " + authUser ? authUser.uid : "authUser is null" + ": " + error.message);
              reject(error);
            })
        else  {
          console.log("In update userInfo skipping document read, we already have it");
          resolve(this.currentUserInfo);
        }
      } else {
        this.currentUserInfo = null;
        resolve(this.currentUserInfo);
      }
    })


  }


  public updateProfileInfo(profileInfo) {

    this.currentUserInfo.profile = profileInfo;
    return this.db.updateDocument('users', this.currentAuthUser.uid, this.currentUserInfo)
      .then(() => {
        this.currentUserInfo.profile = profileInfo;
      })

  }



  public toggleAddToHome(orgId) {

    if (!this.currentUserInfo.favorites)
      this.currentUserInfo.favorites = {
        organizations: {}
      }


    var orgFavorites = this.currentUserInfo.favorites.organizations || {};

    // toggle
    if (orgFavorites.hasOwnProperty(orgId))
      delete orgFavorites[orgId];
    else
      orgFavorites[orgId] = true;

    this.currentUserInfo.favorites.organizations = orgFavorites;

    this.db.updateDocument('users', this.currentAuthUser.uid, this.currentUserInfo)
      .then(() => {
        console.log("Toggled AddtoHome for orgID: " + orgId);
      })
      .catch(error =>
        console.error("Error toggling AddToHome or orgID: " + orgId + ': ' + error.message));
  }

  public toggleFavoriteActivity(id) {

    if (!this.currentUserInfo.favorites)
      this.currentUserInfo.favorites = {
        activities: {}
      }

    var activityFavorites = this.currentUserInfo.favorites.activities || {};

    // toggle
    if (activityFavorites.hasOwnProperty(id))
      delete activityFavorites[id];
    else
      activityFavorites[id] = true;

    this.currentUserInfo.favorites.activities = activityFavorites;

    this.db.updateDocument('users', this.currentAuthUser.uid, this.currentUserInfo)
  }



}
