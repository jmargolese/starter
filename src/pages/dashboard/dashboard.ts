import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { UserProvider } from '../../share-common/providers/user/user';
import { DataProvider } from '../../share-common/providers/data/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  public donations: Observable<any[]>;

  public userHasOrganization: boolean = false;
  public showWhichDonations = "donations";

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: DataProvider, public userProvider: UserProvider, public analytics: AnalyticsProvider) {
    // 

  }

  public updateDonations() {
    if (this.showWhichDonations == 'donations')
      this.donations = this.db.getDonationRecords("donations", true, this.userProvider.getUserId());
    else
      this.donations = this.db.getDonationRecords("donations", false, this.userHasOrganization);
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad DashboardPage');
    //this.donations = this.db.getDocument('donations', '1');

    this.userHasOrganization = this.userProvider.userHasOrganization();
    this.updateDonations();
  }

  ionViewDidEnter() {
    this.analytics.setCurrentScreen('BrowsePage');
  }

  public selectionChanged(event) {
    console.log("Selection changed: " + this.showWhichDonations);
    this.updateDonations();
  }

}