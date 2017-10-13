
import { Observable } from 'rxjs/Observable';
import { ActivitiesProvider } from './../../providers/activities/activities';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the OrgHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-org-home',
  templateUrl: 'org-home.html',
})
export class OrgHomePage {

  public organization = null;
  public activities: Observable<any> = null;

  public topBackgroundColor = "#FFFFFF";

  constructor(public navCtrl: NavController, public navParams: NavParams, public activitiesProvider: ActivitiesProvider) {
      this.organization = navParams.get('organization');
      this.topBackgroundColor = this.organization.info.backgroundColor || "#FFFFFF";

     this.activities = activitiesProvider.getActivitiesForOrg(this.organization.id);
    /*  .subscribe(activity => {
       console.log("Got an activity in org-home: " + JSON.stringify(activity));
       this.activities = activity;
     }, error => {
       console.error("Query got an error: " + error.message);
     }) */

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrgHomePage');
  }

}
