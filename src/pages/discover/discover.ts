import { notificationRequestInfo } from './../../share-common/interfaces/interfaces.d';
import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';

import { OrganizationProvider } from '../../share-common/providers/organization/organization';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

import * as shareTypes from '../../share-common/interfaces/interfaces';
import * as constants from '../../share-common/config/constants';
import { ErrorReporterProvider } from '../../share-common/providers/error-reporter/error-reporter';

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

  constructor(private navCtrl: NavController, private navParams: NavParams,
    private orgProvider: OrganizationProvider, private analytics: AnalyticsProvider, private events: Events,
   private err: ErrorReporterProvider) {

    // console.log("In discover.ts env: " + ENV.mode);
    this.events.subscribe(constants.EventTypes.pushNotification, data => {
      const notification: shareTypes.notificationRequestInfo = data;
    })

  }

  setTitle(title) {
    this.title = title;
  }

  public onSearchInput(event: any): void {

    let val = event.target.value;

    console.log("onSearchInput called with:  " + val);
  }

  ionViewWillEnter() {
    this.organizations = this.orgProvider.getAllOrganizations();

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
