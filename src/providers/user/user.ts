import { AuthProvider } from './../auth/auth';
import { DataProvider } from './../data/data';

import { Injectable } from '@angular/core';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';
//import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as firebase from 'firebase/app';

import * as shareTypes from '../../interfaces/interfaces';

import * as chalk from 'chalk';


/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {


  public currentAuthUser: firebase.User = null;
  public currentUser: shareTypes.User = null;
  public userInfoPromise: Promise<any> = null;
  public organizationLikes = [];

  constructor(public db: DataProvider, public auth: AuthProvider) {

  }

  // getters

  public isAuthenticated(): Promise<boolean> {
    // do we have an authenticated user?
    return new Promise((resolve, reject) => {
      this.auth.getUser()
        .then(authUser => {
          this.updateUserInfo(authUser)
            .then((user) => {
              resolve(user == null ? false : true);
            })
        })
        .catch(error => {
          console.error("Error in User:isAuthenticated:" + error.message);
          reject(error);
        })
    })
  }
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

  public userLikesOrganization(orgId: string) : boolean {
    let result: boolean = false;
    if (this.currentUser && this.currentUser.favorites && this.currentUser.favorites.organizations &&
      this.currentUser.favorites.organizations.hasOwnProperty(orgId)) {
        result = true;
    }

    return result;
  }

  public getFavoriteOrganizations(): Observable<any> {
    this.organizationLikes = [];   // reset before we work
    let orgSubject: Subject<any> = new Subject;


    if (this.currentUser && this.currentUser.favorites && this.currentUser.favorites.organizations) {
      // or try .getOwnPropertyNames

      Object.keys(this.currentUser.favorites.organizations).forEach(orgLike => {
        this.db.getDocument('organizations', orgLike)
          .subscribe(org => {
            org.id = orgLike;            // getDocument doesn't retrieve the id, but we happen to have it
            this.organizationLikes.push(org);
            //orgSubject.next(org);
          }, error => {
            console.error("Error retrieving document in userProvider:getOrganizationFavorties for key: '" + orgLike + "': " + error.message);
          })
      })

    }

    // https://stackoverflow.com/questions/41806188/how-to-create-an-observable-in-angular-2
    return Observable.of(this.organizationLikes);
   //https://stackoverflow.com/questions/14466285/can-i-observe-additions-to-an-array-with-rx-js
   //return orgSubject;
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
  }): Promise<any> {
    let newUser: shareTypes.User = <shareTypes.User>{};
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

    newUser.organization = null;
    newUser.contactPrefs = <shareTypes.UserContactPrefs>{
      emailForGeneral: userInfo.contactPrefs.emailForGeneral,
      emailForLikes: userInfo.contactPrefs.emailForLikes
    };





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

  private promisePending: boolean = false;

  public updateUserInfo(authUser: firebase.User): Promise<shareTypes.User> {
    // called after a user auth change to ensure we keep the local user info update to date

    this.currentAuthUser = authUser;
    console.log("User: updateUserInfo called with user: " + (this.currentAuthUser ? this.currentAuthUser.uid : "curentAuthUser is null"));

    if (this.userInfoPromise && this.promisePending) {
      console.log(chalk.blue("returning existing promise in updateUserInfo"));
      return this.userInfoPromise;
    } else {
      this.userInfoPromise = new Promise((resolve, reject) => {

        this.promisePending = true;

        if (this.currentAuthUser) {       // null if logged out
          if (!this.currentUser || (authUser.uid != this.currentUser.uid))
            this.db.getDocument('users', authUser.uid)
              .subscribe(userInfo => {
                this.currentUser = userInfo;

                console.log("update userInfo resolved");
                this.promisePending = false;
                resolve(this.currentUser);
              }, error => {

                console.error("In userProvider updatingUserInfo for uid: " + authUser ? authUser.uid : "authUser is null" + ": " + error.message);
                this.promisePending = false;
                reject(error);
              })
          else {
            console.log("In update userInfo skipping document read, we already have it");
            this.promisePending = false;
            resolve(this.currentUser);
          }
        } else {
          this.currentUser = null;
          this.promisePending = false;
          resolve(this.currentUser);
        }
      })

      return this.userInfoPromise;
    }



  }



  public updatePaymethods(paymethods: shareTypes.PayMethod[]): Promise<any> {
    this.currentUser.paymethods = paymethods;

    return new Promise((resolve, reject) => {
      this.db.updateDocument('users', this.currentAuthUser.uid, this.currentUser)
        .then(() => {
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

  // actions **********************************************

  public login(email: string, password: string): Promise<shareTypes.User> {

    return new Promise((resolve, reject) => {
      this.auth.login(email, password)
        .then(authUser => {
          this.updateUserInfo(authUser)
            .then(user => {
              resolve(user);
            })
        })
        .catch(error => {
          console.error("Error in user:login: " + error.message);
          reject(error);
        })
    })

  }

  public logout(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth.logout()
        .then(() => {
          this.updateUserInfo(null)
          .then(() => {
            resolve();
          })
        })
        .catch(error => {
          console.error("Error in user: logout: " + error.message);
          reject(error);
        })
    })


  }

  public toggleAddToHome(orgId: string, onlyTurnOn: boolean): Promise<any> {
      // if onlyTurnOn then we can turn it on, but not off  (i.e. if user is logged out and requests a toggle, don't turn it off)

        return new Promise((resolve, reject) => {
    
          if (!this.currentUser.favorites)
            this.currentUser.favorites = {
              "activities": {},
              "organizations": {}
            }
          var orgFavorites = this.currentUser.favorites.organizations || {};
    
          // toggle
          if (orgFavorites.hasOwnProperty(orgId) && !onlyTurnOn)
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
        this.currentUser.favorites = {
          "activities": {},
          "organizations": {}
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
