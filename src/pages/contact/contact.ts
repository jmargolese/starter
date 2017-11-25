import { LoginPage } from './../../share-common/pages/login/login';
import { activitySeeds } from './../../seeds/seedActivities';
import { userDataSeeds } from './../../seeds/seedUserData';
import { donationSeeds } from './../../seeds/seedDonations';


import { Component } from '@angular/core';
import { NavController , ModalController, IonicPage} from 'ionic-angular';

import { orgSeeds, testStripeAcct } from '../../seeds/seedOrganizations';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

// providers
import { AuthProvider } from './../../share-common/providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  private organizationsCollection: AngularFirestoreCollection<any>;
  private stripeAccountsCollection: AngularFirestoreCollection<any>;

  constructor(public navCtrl: NavController, private readonly afs: AngularFirestore, private myAuth: AuthProvider, public modalCtrl: ModalController) {
    this.organizationsCollection = afs.collection<any>('organizations');
    this.stripeAccountsCollection = afs.collection<any>('stripeAccountObjects');
  }

  public login(): void {

    //this.myAuth.login("fred.ipmw+20@gmail.com", "abc123");
    const loginModal = this.modalCtrl.create(LoginPage);
    loginModal.present();

  }

  public logout(): void {

    this.myAuth.logout();

  }
  public seedOrgs(): void {
    console.log("seedOrgs called");

    orgSeeds.forEach(org => {
      console.log("This is the org: " + org.key);

      this.organizationsCollection.doc(org.key).set(org.data)
        .then(() => {
          console.log("Wrote document for:" + org.key)
          console.log("Adding Stripe Account for:" + org.key);

          this.stripeAccountsCollection.doc(org.key).set(testStripeAcct)
            .then(()=> {
              console.log("Wrote Stripe account for: "+org.key)
            }).catch(error => {
              console.error("Error Stripe Account document for " + org.key + "error: " + error.message);
            });
        }).catch(error => {
          console.error("Error writing Org document for " + org.key + " error: " + error.message);
        });
    })
  }

  public seedDonations(): void {
    console.log("seedDonations called");

    let collection : AngularFirestoreCollection<any>  = this.afs.collection<any>('donations');

    donationSeeds.forEach(org => {
      console.log("This is the donation: " + org.key);

      collection.doc(org.key).set(org.data).then(() => {
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
