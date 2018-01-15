import { OrganizationProvider } from './../../share-common/providers/organization/organization';
import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { UserProvider } from '../../share-common/providers/user/user';
import { DataProvider } from '../../share-common/providers/data/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import * as shareTypes from "../../share-common/interfaces/interfaces";

@IonicPage()
@Component({
  selector: 'page-impact',
  templateUrl: 'impact.html',
})
export class ImpactPage {

  public donations: shareTypes.Donation[];

  public userHasOrganization: boolean = false;
  public showWhichDonations = "donations";

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: DataProvider, 
    public userProvider: UserProvider, public analytics: AnalyticsProvider, public org: OrganizationProvider) {
    
  }

  public updateDonations() {
    if (this.showWhichDonations == 'donations')
      this.db.getDonationRecords("donations", true, this.userProvider.getUserId())
      .subscribe(donations => {
        this.donations = donations;
        this.donations.forEach(donation  => {
            this.org.getOrganizationLogoUrl(donation.recipient.id)
            .then(url => {
              donation.recipient.icon = url;
            })
        })
      })
    else {
      this.db.getDonationRecords("donations", false, this.userProvider.getOrganizationId())
      .subscribe(donations => {
        this.donations = donations;
       
      })
    }
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad impactPage');
    //this.donations = this.db.getDocument('donations', '1');

    this.userHasOrganization = this.userProvider.userHasOrganization();
    this.updateDonations();
  }

  ionViewDidEnter() {
    this.analytics.setCurrentScreen('impact');
  }

  public selectionChanged(event) {
    console.log("Selection changed: " + this.showWhichDonations);
    this.updateDonations();
  }

}