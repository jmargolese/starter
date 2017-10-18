import { activitySeeds } from './../../seeds/seedActivities';
import { userDataSeeds } from './../../seeds/seedUserData';

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { orgSeeds } from '../../seeds/seedOrganizations';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

// providers
import { AuthProvider } from './../../providers/auth/auth';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  private organizationsCollection: AngularFirestoreCollection<any>;

  constructor(public navCtrl: NavController, private readonly afs: AngularFirestore, private myAuth: AuthProvider) {
    this.organizationsCollection = afs.collection<any>('organizations');


  }

  public login(): void {

    this.myAuth.login("fred.ipmw+20@gmail.com", "abc123");

  }

  public logout(): void {

    this.myAuth.logout();

  }
  public seedOrgs(): void {
    console.log("seedOrgs called");

    orgSeeds.forEach(org => {
      console.log("This is the org: " + org.key);

      this.organizationsCollection.doc(org.key).set(org.data).then(() => {
        console.log("Wrote document for:" + org.key)
      }
      )
        .catch(error => {
          console.error("Error writing document for " + org.key + " error: " + error.message);
        })
    })
  }

  public seedUserData(): void {
    console.log("seedUserData called");

    let collection : AngularFirestoreCollection<any>  = this.afs.collection<any>('users')

    userDataSeeds.forEach(user => {
      console.log("This is the user: " + user.key);

      collection.doc(user.key).set(user.data).then(() => {
        console.log("Wrote document for:" + user.key)
      }
      )
        .catch(error => {
          console.error("Error writing document for " + user.key + " error: " + error.message);
        })
    })
  }

  public seedActivities(): void {
    console.log("seedActivityData called");

    let collection : AngularFirestoreCollection<any>  = this.afs.collection<any>('activities')

    activitySeeds.forEach(activity => {
      console.log("This is the activity: " + activity.key);

      collection.doc(activity.key).set(activity.data).then(() => {
        console.log("Wrote document for:" + activity.key)
      }
      )
        .catch(error => {
          console.error("Error writing document for " + activity.key + " error: " + error.message);
        })
    })
  }

  public checkAuth() {

    console.log("Are we authenticated? " + this.myAuth.isAuthenticated());
  }

}
