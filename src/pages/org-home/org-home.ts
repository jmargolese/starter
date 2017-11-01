import { ActivitiesProvider } from './../../share-common-providers/activities/activities';

import { Observable } from 'rxjs/Observable';
//import { ActivitiesProvider } from '../../../../common/src/share-common-providers/activities';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';




@IonicPage()
@Component({
  selector: 'page-org-home',
  templateUrl: 'org-home.html',
})
export class OrgHomePage {

  public organization = null;
  //public activities: Observable<any> = null;

  
 public hideHeader: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public activitiesProvider: ActivitiesProvider) {
    
     if (navParams.get('showHeader')){
        this.hideHeader = false;
     }

    // this.activities = activitiesProvider.getActivitiesForOrg(this.organization.id);
    /*  .subscribe(activity => {
       console.log("Got an activity in org-home: " + JSON.stringify(activity));
       this.activities = activity;
     }, error => {
       console.error("Query got an error: " + error.message);
     }) */

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrgHomePage');
    this.organization = this.navParams.get('organization');
    //this.testMe.testMe();  //
  }

}
