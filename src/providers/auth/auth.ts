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
    this.user.subscribe((user: firebase.User) => {

      console.log('AuthProvider subscribe: user is: ' +  user && user.uid);
      this.currentUser = user;
     
      userProvider.updateUserInfo(this.currentUser);
    });

  }

  getUser(): firebase.User {
    return this.currentUser;
  }

  getAuthState(): Observable<firebase.User> {
    return this.user;
  }
  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        this.currentUser = user;
        console.log("Login successful with user: " + user.email);
        this.userProvider.updateUserInfo(this.currentUser);
      })
      .catch(error => {
        console.error("Login failed for user: '" + email + "' with error: " + error.message);
      })
  }

  logout() {
    this.afAuth.auth.signOut();
    this.currentUser = null;
    this.userProvider.updateUserInfo(this.currentUser);
  }
  sayHello(message: string) {
    console.log("AuthProvider.sayHello called! " + message);
  }

  authenticated(): boolean {
    return this.user ? true : false;
  }
}
