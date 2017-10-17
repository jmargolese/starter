import { OrganizationProvider } from './../../providers/organization/organization';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
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
  selector: 'page-browse',
  templateUrl: 'browse.html',
})
export class BrowsePage {

  public organizations: Observable<any[]>;
  private organizationsCollection: AngularFirestoreCollection<any>;
  public title:string = "Browse";

  constructor(public navCtrl: NavController, public navParams: NavParams, public orgProvider: OrganizationProvider) {

   

  }

  setTitle(title){
    this.title = title;
}

  public onSearchInput( event: any): void {
    
    let val = event.target.value;

    console.log("onSearchInput called with:  " + val);
  }

  ionViewWillEnter() {
    this.organizations = this.orgProvider.getAllOrganizations();
  }
  ionViewDidLoad() {

    console.log('ionViewDidLoad BrowsePage');
   
  }

  toggleHome() {
    // toggles the 'add/remove' to home setting
    
  }

}
