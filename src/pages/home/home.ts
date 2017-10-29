import { OrgHomePage } from './../org-home/org-home';
import { UserProvider } from './../../providers/user/user';
import { Component } from '@angular/core';

import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface Organization { };

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  public organizations: Observable<any[]>;
  private organizationsCollection: AngularFirestoreCollection<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider) {




    /* this.organizations = db.collection('organizations').valueChanges();

    this.organizations.subscribe(snapshot => {
      console.log("organization snapshow: " + JSON.stringify(snapshot))
    }) */

  }

  public onSearchInput(event: any): void {

    let val = event.target.value;

    //console.log("onSearchInput called with:  " + val);
  }

  ionViewWillEnter() {

    // ensure we've completed our login check before trying to load anything
    this.userProvider.isAuthenticated()
      .then((isAuthenticated) => {
        console.log("in home.ts ionViewWillEnter are we authenticated? " + isAuthenticated);
        // make the call regardless so that we are tracking the observable in case we do login
        this.organizations = this.userProvider.getFavoriteOrganizations();
      })


  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

}
