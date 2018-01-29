import { LoginPage } from './../../share-common/pages/login/login';
import { activitySeeds } from './../../seeds/seedActivities';
import { userDataSeeds } from './../../seeds/seedUserData';
import { donationSeeds } from './../../seeds/seedDonations';


import { Component } from '@angular/core';
import { NavController , ModalController, IonicPage, Events} from 'ionic-angular';

import { orgSeeds, testStripeAcct } from '../../seeds/seedOrganizations';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ENV } from '@app/env';
import * as shareTypes from '../../share-common/interfaces/interfaces';
import * as constants from '../../share-common/config/constants';

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
  public projectId : string = "";

  constructor(public navCtrl: NavController, private readonly afs: AngularFirestore, private myAuth: AuthProvider, 
    public modalCtrl: ModalController, private events: Events) {
    this.organizationsCollection = afs.collection<any>('organizations');
    this.stripeAccountsCollection = afs.collection<any>('stripeAccountObjects');
    this.projectId = ENV.firebase.projectId
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

  public testNotification() {
    let notification : shareTypes.notificationRequestInfo = {
      type: constants.notificationTypes.showOrg,
      targetId: 'orgDesireStreet',
      foreground: false,
      title: "Special event from ChadTough",
      message: "Come join us for the special event",
      data : null
    }

    
    // add in custom data and actions per event
    switch (notification.type) {
      case constants.notificationTypes.showOrg:
        notification.data = {
          activityID: "",
          campaignCode: '122"'
        }
        // publish that this exists.  It's not guaranteed that our recipients will exist when we push this, so 
        // they are responsible for checking when they get created, just in case
        this.events.publish(constants.EventTypes.pushNotification, notification);
        break;

      default:
        break;
    }
  }
}
