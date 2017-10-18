import { UserProvider } from './../user/user';
import { Injectable } from '@angular/core';


import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

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

  constructor(public afAuth: AngularFireAuth, public userProvider: UserProvider) {
    console.log('Hello AuthProvider Provider');

    this.user = afAuth.authState;

    this.updateCurrentUser(firebase.auth().currentUser);
    console.log("At startup we are authenticated? : " + this.isAuthenticated());

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
        console.log('Firebase Auth: ', user.uid);
        this.updateCurrentUser(user);
      } else {
        // No user is signed in.
        console.log('Firebase Auth None');
        this.currentUser = null;
      }
    });

  }

  // getters

  getUser(): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        this.updateCurrentUser(user)
          .then(() => {
            resolve(user)
          }
          )

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
    this.currentUser = user;
    return this.userProvider.updateUserInfo(this.currentUser);   // keep the userProvider in sync with our user at all times
  }

  // end setters

  // methods
  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        this.updateCurrentUser(user);
        console.log("Login successful with user: " + user.email);

      })
      .catch(error => {
        console.error("Login failed for user: '" + email + "' with error: " + error.message);
      })
  }

  logout() {
    this.afAuth.auth.signOut();
    this.currentUser = null;
    this.userProvider.updateUserInfo(this.currentUser);
    console.log("AuthProvider logout complete");
  }

  public updatePasscode(currentPasscode, newPasscode) {

    const credential = firebase.auth.EmailAuthProvider.credential(this.currentUser.email, currentPasscode);

    return this.currentUser.reauthenticateWithCredential(credential)
      .then(() => {
        this.currentUser.updatePassword(newPasscode)
          .then(() => {
            console.log("passcode update successful");
          })
          .catch(error => {
            console.error("passcode update failed: " + error.message);
            Promise.reject(error);
          })
      })
      .catch(error => {
        console.error("Error reauthenteWithCredential: " + error.message);
        Promise.reject(error);
      })



  }

  public resetPasscode() {
    return this.afAuth.auth.sendPasswordResetEmail(this.currentUser.email)
      .then(() => {
        console.log("reset passcode succeeded (sent email)");
      })
      .catch(error => {
        console.error("Resetpasscode failed for: " + this.currentUser.email + " error: " + error.message);
        Promise.reject(error);
      })
  }
  // end methods


}
