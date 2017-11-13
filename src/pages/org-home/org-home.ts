
import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { ActivitiesProvider } from '../../share-common/providers/activities/activities';

import { Observable } from 'rxjs/Observable';
//import { ActivitiesProvider } from '../../../../common/src/share-common/providers/activities';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';


import * as shareTypes from '../../share-common/interfaces/interfaces';
import { UserProvider } from '../../share-common/providers/user/user';

@IonicPage()
@Component({
  selector: 'page-org-home',
  templateUrl: 'org-home.html',
})
export class OrgHomePage {

  public organization : shareTypes.Organization = null;
  public showDonateButton : boolean = false;
  public showAddToHomeButton : boolean = false;

  public currentActivity: shareTypes.Activity = null;
  //public activities: Observable<any> = null;

  
 public hideHeader: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public activitiesProvider: ActivitiesProvider, 
    public events:Events, public analytics:AnalyticsProvider, public userProvider: UserProvider) {
    
     if (navParams.get('showHeader')){
        this.hideHeader = false;
     }

     this.events.subscribe("activity:homeCurrentActivity", (activity) => {
      // let other parts of the app tell us when a new tab is needed
      this.currentActivity = activity;
    });

    this.showDonateButton = false;
    
  }

  ionViewDidEnter() {
    this.analytics.setCurrentScreen('org-Home');
    this.showDonateButton = true;
  }

  ionViewWillLeave() {
    this.showDonateButton = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrgHomePage');
    this.organization = this.navParams.get('organization');
    this.showAddToHomeButton =  this.userProvider.userLikesOrganization(this.organization.id) ? false : true;
    //this.testMe.testMe();  //
   
  }

}
