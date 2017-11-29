import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';

import { OrganizationProvider } from '../../share-common/providers/organization/organization';

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  selector: 'page-discover',
  templateUrl: 'discover.html',
})
export class DiscoverPage {

  public organizations: Observable<any[]>;
  public title: string = "Discover";
  public showSearchBar: boolean = false;         // we can turn it back on when we support it

  constructor(public navCtrl: NavController, public navParams: NavParams, public orgProvider: OrganizationProvider, public analytics: AnalyticsProvider) {

    // console.log("In discover.ts env: " + ENV.mode);


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
