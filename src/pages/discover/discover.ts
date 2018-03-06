import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';

import { OrganizationProvider } from '../../share-common/providers/organization/organization';

import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

import { ErrorReporterProvider } from '../../share-common/providers/error-reporter/error-reporter';
import { UserProvider } from '../../share-common/providers/user/user';

//import { ENV } from '@app/env';


export interface Organization { };

@IonicPage()
@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html',
})
export class DiscoverPage {

  public organizations: Observable<any[]>;
  public title: string = "Discover";
  public showSearchBar: boolean = false;         // we can turn it back on when we support it

  constructor( private orgProvider: OrganizationProvider, private analytics: AnalyticsProvider,
   private err: ErrorReporterProvider, private user: UserProvider) {

    // console.log("In discover.ts env: " + ENV.mode);
    //this.events.subscribe(constants.EventTypes.pushNotification, data => {
     // const notification: shareTypes.notificationRequestInfo = data;
    //})

  }

  setTitle(title) {
    this.title = title;
  }

  public onSearchInput(event: any): void {

    let val = event.target.value;

    this.err.log("onSearchInput called with:  " + val);
  }

 /*  ionViewWillEnter() {
    this.organizations = this.orgProvider.getAllOrganizations(true, true);

  } */

  ionViewWillEnter() {
    // show test orgs if our user is a tester.
    const testMode = this.user.isRoleTester();
    // we don't enable test orgs.
    const enabledOnly = testMode ? false : true;

    this.organizations = this.orgProvider.getAllOrganizations(enabledOnly, true, true, testMode);

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad discoverPage');

  }

  ionViewDidEnter() {
    this.analytics.setCurrentScreen('discoverPage');
  }

  toggleHome() {
    // toggles the 'add/remove' to home setting

  }

}
