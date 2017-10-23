import { DataProvider } from './../data/data';

import { Injectable } from '@angular/core';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';
//import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';


import * as firebase from 'firebase/app';

import * as shareTypes from '../../interfaces/interfaces';




/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {


  currentAuthUser: firebase.User = null;
  currentUser: shareTypes.User = null;

  public organizationLikes = [];

  constructor(public db: DataProvider) {

  }

  // getters
  public getUserProfile(): shareTypes.UserProfile {


    if (!this.currentUser)
      throw new Error('getUserProfile called with no logged in user');
    else
      return this.currentUser.profile;

  }

  public getDisplayName(): String {
    return this.currentUser ? this.currentUser.profile.name.first + " " + this.currentUser.profile.name.last : "";
  }

  public getUserInfo(): shareTypes.UserInfo {
    return this.currentUser.info;
  }

  public getUserId(): string {
    return this.currentAuthUser ? this.currentAuthUser.uid : ""
  }

  public getPaymethods(): shareTypes.PayMethod[] {

    return (this.currentUser && this.currentUser.paymethods) ? this.currentUser.paymethods : [];
  }

  public userHasOrganization(): boolean {
    return this.currentUser && this.currentUser.organization ? true : false;
  }
  public isUserFavorite(type, id) {
    let retVal = false;

    if (this.currentUser) {
      if (this.currentUser.favorites) {
        let toTest = type == 'activities' ? (this.currentUser.favorites.activities || {}) : (this.currentUser.favorites.organizations || {});

        retVal = toTest.hasOwnProperty(id) ? true : false;
      }
    }

    return retVal;
  }

  public isRoleDemo(): boolean {
    return this.currentUser ? this.currentUser.info.isDemo : false;
  }

  public getFavoriteOrganizations(): any {
    this.organizationLikes = [];   // reset before we work


    if (this.currentUser && this.currentUser.favorites && this.currentUser.favorites.organizations) {
      // or try .getOwnPropertyNames

      Object.keys(this.currentUser.favorites.organizations).forEach(orgLike => {
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
    lastName: string,
    contactPrefs: {
      emailForLikes: boolean,
      emailForGeneral: boolean
    }
  }) : Promise<any> {
    let newUser: shareTypes.User;
    newUser.profile = {
      name: {
        first: userInfo.firstName,
        last: userInfo.lastName,
      },
      email: userInfo.email,
      phoneNumber: ""            // this is really a dupe of what's in the auth record, but used here for convenience
    }

    newUser.info = {
      isDemo: false,
      isAdmin: false,
      isEnabled: true
    }

    newUser.organization = null,

    newUser.contactPrefs.emailForGeneral = userInfo.contactPrefs.emailForLikes;
    newUser.contactPrefs.emailForGeneral = userInfo.contactPrefs.emailForGeneral;



    return new Promise((resolve, reject) => {
      this.db.createDocument('users', this.currentAuthUser.uid, newUser)
        .then(() => {
          this.currentUser = newUser;
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
    console.log("User: updateUserInfo called with user: " + (this.currentAuthUser ? this.currentAuthUser.uid : "curentAuthUser is null"));

    return new Promise((resolve, reject) => {
      if (this.currentAuthUser) {       // null if logged out
        if (!this.currentUser || (authUser.uid != this.currentUser.uid))
          this.db.getDocument('users', authUser.uid)
            .subscribe(userInfo => {
              this.currentUser = userInfo;
              resolve(this.currentUser);
            }, error => {

              console.error("In userProvider updatingUserInfo for uid: " + authUser ? authUser.uid : "authUser is null" + ": " + error.message);
              reject(error);
            })
        else {
          console.log("In update userInfo skipping document read, we already have it");
          resolve(this.currentUser);
        }
      } else {
        this.currentUser = null;
        resolve(this.currentUser);
      }
    })


  }


  public updatePaymethods(paymethods: shareTypes.PayMethod[]): Promise<any> {
    this.currentUser.paymethods = paymethods;

    return new Promise((resolve, reject) => {
      this.db.updateDocument('users', this.currentAuthUser.uid, this.currentUser)
        .then(() => {
          this.currentUser.paymethods = paymethods;
          resolve();
        })
        .catch(error => {
          console.error("Error in user:updatePaymethods: " + error.message);
          reject(error);
        })
    });

  }

  public updateProfileInfo(profileInfo): Promise<any> {

    this.currentUser.profile = profileInfo;
    return new Promise((resolve, reject) => {
      this.db.updateDocument('users', this.currentAuthUser.uid, this.currentUser)
        .then(() => {
          this.currentUser.profile = profileInfo;
          resolve();
        })
        .catch(error => {
          console.error("Error in user:updateProfileInfo: " + error.message);
          reject(error);
        })
    })


  }



  public toggleAddToHome(orgId): Promise<any> {

    return new Promise((resolve, reject) => {

      if (!this.currentUser.favorites)
        this.currentUser.favorites.organizations = {};

      var orgFavorites = this.currentUser.favorites.organizations || {};

      // toggle
      if (orgFavorites.hasOwnProperty(orgId))
        delete orgFavorites[orgId];
      else
        orgFavorites[orgId] = true;

      this.currentUser.favorites.organizations = orgFavorites;

      this.db.updateDocument('users', this.currentAuthUser.uid, this.currentUser)
        .then(() => {
          console.log("Toggled AddtoHome for orgID: " + orgId);
          resolve();
        })
        .catch(error => {
          console.error("Error toggling AddToHome or orgID: " + orgId + ': ' + error.message);
          reject(error);
        })
    })

  }

  public toggleFavoriteActivity(id): Promise<any> {

    return new Promise((resolve, reject) => {
      if (!this.currentUser.favorites)
        this.currentUser.favorites.activities = {
          activities: {}
        }

      var activityFavorites = this.currentUser.favorites.activities || {};

      // toggle
      if (activityFavorites.hasOwnProperty(id))
        delete activityFavorites[id];
      else
        activityFavorites[id] = true;

      this.currentUser.favorites.activities = activityFavorites;

      this.db.updateDocument('users', this.currentAuthUser.uid, this.currentUser)
        .then(() => {
          resolve();
        })
        .catch(error => {
          console.error("Error calling updateDocument in toggleFavoriteActivity: " + error.message);
          reject(error);
        })
    })


  }



}
