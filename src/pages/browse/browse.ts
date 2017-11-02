import { AnalyticsProvider } from '../../share-common-providers/analytics/analytics';

import { OrganizationProvider } from '../../share-common-providers/organization/organization';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';

//import { ENV } from '@app/env';

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
  public title: string = "Discover";

  constructor(public navCtrl: NavController, public navParams: NavParams, public orgProvider: OrganizationProvider, public analytics: AnalyticsProvider) {

    // console.log("In browse.ts env: " + ENV.mode);


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

    console.log('ionViewDidLoad BrowsePage');

  }

  ionViewDidEnter() {
    this.analytics.setCurrentScreen('BrowsePage');
  }

  toggleHome() {
    // toggles the 'add/remove' to home setting

  }

}
