import { Organization } from './../home/home';

import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { ActivitiesProvider } from '../../share-common/providers/activities/activities';

import { Observable } from 'rxjs/Observable';
//import { ActivitiesProvider } from '../../../../common/src/share-common/providers/activities';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';


import * as shareTypes from '../../share-common/interfaces/interfaces';
import { UserProvider } from '../../share-common/providers/user/user';

import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-org-home',
  templateUrl: 'org-home.html',
})
export class OrgHomePage {

  public organization: shareTypes.Organization = null;
  private organizationFavorites: shareTypes.Organization[] = null;
  private orgIndex: number;
  public showNextButton: boolean = false;
  public showPrevButton: boolean = false;
  public showNavButtons: boolean = true;

  public showDonateButton: boolean = false;
  public showAddToHomeButton: boolean = false;

  public currentActivity: shareTypes.Activity = null;
  //public activities: Observable<any> = null;
  private useOrgFavorites: boolean = false;       // should we use a passed in org or get the list of favorites?

  public hideHeader: boolean = true;
  private isVisible: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public activitiesProvider: ActivitiesProvider,
    public events: Events, public analytics: AnalyticsProvider, public userProvider: UserProvider) {
    console.log("Entered orgHomePage");
    if (navParams.get('showHeader')) {
      this.hideHeader = false;
    }

    this.events.subscribe("activity:homeCurrentActivity", (activity) => {
      // let other parts of the app tell us when a new tab is needed
      this.currentActivity = activity;
    });


    // in case someone presses 'remove from home' we have to respond
    this.events.subscribe('action-button:complete', data => {

      if (data.type == "addToHome" && this.isVisible) {       // only do this check if we are visible rather than cached

        // we need to see if our organization still is in the favorites list.
        this.organizationFavorites = this.userProvider.getFavoriteOrganizations();

        if (!_.find(this.organizationFavorites, ['id', this.organization.id])) {
          // the organization we are displaying was removed from the list, so:
          if (this.orgIndex == 0) {
            if (this.organizationFavorites.length) {
              // we are the root and there is at least one more, so change our identity
              this.setOrganization(0);
            } else {
              // we are the last so just display the 'get more favorites message'
              this.organization = null;
            }
          }
          else {
            // if we are up in the stack, just pop.
            this.prev();
          }
        }
      }

    })
    this.showDonateButton = false;

  }

  ionViewWillEnter() {
    this.isVisible = true;

  }

  ionViewDidEnter() {
    this.analytics.setCurrentScreen('org-Home');
    this.showDonateButton = true;
    console.log("orgHomePage: ionViewDidEnter");

    this.userProvider.isAuthenticated()
      .then(() => {

        this.useOrgFavorites = this.navParams.get('useOrgFavorites') ? true : false;

        if (this.useOrgFavorites)
          this.orgIndex = this.navParams.get('orgIndex')
        // this means we are part of a list of organization favorites with an index, as opposed to be being passed in an organization
        this.setOrganization(this.orgIndex || 0);


      })
  }

  public setOrganization(orgIndex: number) {

    if (this.useOrgFavorites) {
      this.hideHeader = true;
      this.showNavButtons = true;
      this.showAddToHomeButton = false;
      this.organizationFavorites = this.userProvider.getFavoriteOrganizations();
      if (this.organizationFavorites.length) {

        this.organization = this.organizationFavorites[orgIndex];
        this.showPrevButton = orgIndex > 0;
        this.showNextButton = orgIndex < this.organizationFavorites.length - 1;
      } else
        this.organization = null;
    } else {
      this.organization = this.navParams.get('organization') || null;
      this.showAddToHomeButton = this.userProvider.userLikesOrganization(this.organization.id) ? false : true;
    }

    if (!this.organization)
      console.error("Organization is null in orgHomePage");
    else {

      //this.testMe.testMe();  //
      console.log('ionViewDidLoad OrgHomePage and showAddToHome is: ' + this.showAddToHomeButton);
      //
    }
  }

  public swipeEvent(event) {

    switch (event.direction) {
      case 2:
        this.next();
        break;
      case 4:
        this.prev();
      default:
        break;
    }


  }

  public next() {
    if (this.orgIndex < this.organizationFavorites.length - 1) {
      this.navCtrl.push('OrgHomePage', { useOrgFavorites: true, orgIndex: this.orgIndex + 1 })
    }
  }

  public prev() {
    this.navCtrl.pop();
  }



  ionViewWillLeave() {
    this.isVisible = false;
    this.showDonateButton = false;
    this.showAddToHomeButton = false;
  }

  ionViewDidLoad() {


  }

}
