
import { ModalController, Events } from 'ionic-angular';

import { Injectable } from '@angular/core';
import Raven from 'raven-js';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

//import * as shareTypes from '../../interfaces/interfaces';
/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  authState: any = null;
  currentUser: firebase.User = null;
  user: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth, public modalCtrl: ModalController, public events: Events) {
    console.log('Hello AuthProvider Provider');

    this.user = afAuth.authState;

    this.getUser()
      .then(() => {
        console.log("At startup we are authenticated? : " + this.isAuthenticated());
      })


    // THis is the official way to monitor user changes but isn't working, so we fall back on the raw firebase call
    /*
    this.user.subscribe((user: firebase.User) => {

      console.log('AuthProvider subscribe: user is: ' +  user ? user.uid : "No one logged in");
      this.currentUser = user;
     
      userProvider.updateUserInfo(this.currentUser);
    });
    */

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        console.log('Firebase Auth State changed: ', user.uid);
        this.updateCurrentUser(user);
      } else {
        // No user is signed in.
        console.log('Firebase Auth None');
        this.currentUser = null;
      }
    });

  }

  // manage events

  /* public sendEvent(type: shareTypes.authEventTypes) {
    this.events.publish('auth' + type, this.currentUser);
  } */


  // ***************   End events
  // getters

  public getUser(): Promise<firebase.User> {

    return new Promise((resolve, reject) => {
      if (this.currentUser) {
        resolve(this.currentUser);     // we are done, got the user
      } else {
        firebase.auth().onAuthStateChanged((user) => {
          console.log("Auth:getUser about to call updateCurrentUser with user: " + (user ? user.uid : "User is null"));
          this.updateCurrentUser(user)
            .then(() => {
              // this.sendEvent(user ? shareTypes.authEventTypes.login : shareTypes.authEventTypes.logout);
              resolve(user)
            })
            .catch(error => {
              console.error("Error calling onAuthStateChanged from auth:getUser: " + error.message);
              reject(error);
            })
        })
      }
    })
  }

  public getAuthenticatedUser(message?: string): Promise<any> {
    // message is to display to the user to explain why we are logging in
    // returns an authenticated user or rejects the promise with error({ canceled: true, message : "User canceled"})

    return new Promise((resolve, reject) => {

      this.getUser()
        .then(user => {
          if (user)
            resolve(user)
          else {
            // need to get a user logged in
            const loginModal = this.modalCtrl.create('LoginPage', { message: message ? message : null });
            loginModal.onDidDismiss(data => {
              if (!data.canceled) {
                // should now have a current user
                if (this.currentUser) {
                  console.log("auth:getAuthenticatedUser succeed with logged in user");
                  resolve(this.currentUser);
                }
              } else {
                let error: any = new Error("User canceled");
                error.canceled = true;
                reject(error);
              }
            });
            loginModal.present();
          }
        })
        .catch(error => {
          console.error("Error calling getUser from auth:GetAuthenticatedUser: " + error.message);
          reject(error);
        })

    })


  }

  getAuthState(): Observable<firebase.User> {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.currentUser ? true : false;
  }
  // end getters

  // setters


  private updateCurrentUser(user): Promise<firebase.User> {
    // returns a promise

    return new Promise((resolve, reject) => {
      this.currentUser = user;
      resolve(user);
    })

    //console.log("auth:updateCurrentUser about to call updateUserInfo: " + (user ? user.uid : "User is null"));
    // return this.userProvider.updateUserInfo(this.currentUser);   // keep the userProvider in sync with our user at all times
  }

  // end setters

  // methods
  login(email: string, password: string): Promise<firebase.User> {

    let promise = new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(user => {
          console.log("Login successful with user)" + user.email);
          this.updateCurrentUser(user)
            .then(curUser => {
              Raven.setUserContext({
                email: user.email,
                id: user.uid
              });
              resolve(user);

            })

        })
        .catch(error => {
          console.error("Login failed for user: '" + email + "' with error: " + error.message);
          // Promise.reject(error);
          reject(error);
        })


    });

    return promise as Promise<firebase.User>;

  }

  public logout(): Promise<any> {
    let promise = new Promise((resolve, reject) => {
      this.afAuth.auth.signOut()
        .then(() => {
          console.log("AuthProvider logout complete, about to call updateCurrentUser");
          Raven.setUserContext();
          resolve();;
        })
        .catch(error => {
          console.error("Error in auth:logout: " + error.message);
          reject(error);
        })
    });

    return promise;
  }

  public createAccount(email, passcode): Promise<firebase.User> {

    let promise = new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, passcode)
        .then(user => {
          console.log("Created new user with email: " + user.email);

          Raven.setUserContext({
            email: user.email,
            id: user.uid
          });
          resolve(user);
        })

        .catch(function (error) {
          // Handle Errors here.

          console.log("Error in auth:CreateAccount: " + error.message);
          reject(error);
        });
    });

    return promise as Promise<firebase.User>;

  }

  public updatePasscode(currentPasscode: string, newPasscode: string): Promise<any> {

    const credential = firebase.auth.EmailAuthProvider.credential(this.currentUser.email, currentPasscode);

    return new Promise((resolve, reject) => {
      this.currentUser.reauthenticateWithCredential(credential)
        .then(() => {
          this.currentUser.updatePassword(newPasscode)
            .then(() => {
              console.log("passcode update successful");
              resolve();
            })
            .catch(error => {
              console.error("passcode update failed: " + error.message);
              reject(error);
            })
        })
        .catch(error => {
          console.error("Error reauthenteWithCredential: " + error.message);
          reject(error);
        })
    })




  }

  public resetPasscode(email?: string) {
    let promise = new Promise((resolve, reject) => {

      this.afAuth.auth.sendPasswordResetEmail(email || this.currentUser.email)
        .then(() => {
          console.log("reset passcode succeeded (sent email)");
          resolve();
        })
        .catch(error => {
          console.error("Resetpasscode failed for: " + (email || this.currentUser.email) + " error: " + error.message);
          reject(error);
        })
    });
    return promise;
  }

  // logins

  public loginFacebook(): Promise<any> {
    // Sign in using a popup.
    let promise = new Promise((resolve, reject) => {
      var provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope('user_birthday');
      firebase.auth().signInWithPopup(provider)
        .then(function (result) {
          // This gives you a Facebook Access Token.
          // var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;

          this.updateCurrentUser(user);
          console.log("Logged in user with facebook");
          resolve(user);
        })
        .catch(error => {
          console.error("Error in auth:loginFacebook: " + error.message);
          reject(error);
        })

    })

    return promise;


  }
  // end logins
  // end methods


}
