import { Device } from '@ionic-native/device';
import { ErrorReporterProvider } from './../../share-common/providers/error-reporter/error-reporter';
import { Subscription } from 'rxjs';
import { OrganizationProvider } from './../../share-common/providers/organization/organization';
import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { UserProvider } from '../../share-common/providers/user/user';
import { DataProvider } from '../../share-common/providers/data/data';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import * as shareTypes from "../../share-common/interfaces/interfaces";
import { logTypes, logLevels } from '../../share-common/providers/error-reporter/error-reporter';
import * as constants from '../../share-common/config/constants';

@IonicPage()
@Component({
  selector: 'page-impact',
  templateUrl: 'impact.html',
})
export class ImpactPage {

  public donations: shareTypes.Impact[];

  public userHasOrganization: boolean = false;
  public showWhichDonations = "donations";

  private impactSubscription: Subscription;
  private impactDeviceIdSubscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: DataProvider, private err: ErrorReporterProvider,
    public userProvider: UserProvider, public analytics: AnalyticsProvider, public org: OrganizationProvider,
    private events: Events, private device: Device) {

    this.events.subscribe(constants.EventTypes.userUpdated, user => {
      // if the user logs out, our subscript is instantly invalid and will trigger an uncatchable error
      this.unsubscribeImpactSubscription();
    })

  }

  /* private sortDonations(a: shareTypes.Impact, b: shareTypes.Impact){
    const c = a.time.getTime();
    const d = b.time.getTime();
    return c < d ? 1 : -1;
  } */

  ionViewWillEnter() {
    console.log('ionViewDidLoad impactPage');
    //this.donations = this.db.getDocument('donations', '1');

    this.userHasOrganization = this.userProvider.userHasOrganization();
    this.updateDonations();
  }

  ionViewDidEnter() {
    this.analytics.setCurrentScreen('impact');
  }

  ionViewWillUnload() {
    this.unsubscribeImpactSubscription();
  }

  public uCaseFirstChar(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
  }

  private unsubscribeImpactSubscription() {
    try {
      if (this.impactSubscription) {
        this.impactSubscription.unsubscribe();
      }

      if (this.impactDeviceIdSubscription) {
        this.impactDeviceIdSubscription.unsubscribe();
      }
    } catch (error) {
      // just in case there's an error
    }
  }
  public updateDonations() {
    // if (this.userProvider.getEmail()) {              // Do we have a logged in user?  Else firestore throws and uncatachable permissiosn violation
    if (this.showWhichDonations == 'donations') {
      this.unsubscribeImpactSubscription();
      this.donations = [];
      if (this.userProvider.isLoggedIn()) {
        this.impactSubscription = this.db.getDonationRecords("impact", true, this.userProvider.getUserId())
          .subscribe(donationsAry => {
            const tempDonations: shareTypes.Impact[] = donationsAry as shareTypes.Impact[];
            // this.donations = theDonations.sort(this.sortDonations);
            tempDonations.forEach(donation => {
              this.org.getOrganizationLogoUrl(donation.recipient.id)
                .then(url => {
                  donation.recipient.icon = url;
                  this.donations.push(donation);
                })
                .catch(error => {
                  this.err.log(`ImpactPage: Error Getting LogoOrg URL: ${error.message}`, logTypes.report, logLevels.normal, { error: error, recipientId: donation.recipient.id || 'no recipient id' });
                })
            }, error => {
              this.err.log(`ImpactPage: Error subscribing to Donation ImpactRecords: ${error.message}`, logTypes.report, logLevels.normal, { error: error, userId: this.userProvider.getUserId() || 'No user Id' });
            })
          })
      }
      else {

        this.impactDeviceIdSubscription = this.db.getDonationRecords("impact", true, null, null, this.device.uuid)
          .subscribe(donationsAry => {
            const tempDonations: shareTypes.Impact[] = donationsAry as shareTypes.Impact[];
            // this.donations = theDonations.sort(this.sortDonations);
            tempDonations.forEach(donation => {
              this.org.getOrganizationLogoUrl(donation.recipient.id)
                .then(url => {
                  donation.recipient.icon = url;
                  this.donations.push(donation);
                })
                .catch(error => {
                  this.err.log(`ImpactPage: Error Getting LogoOrg URL: ${error.message}`, logTypes.report, logLevels.normal, { error: error, recipientId: donation.recipient.id || 'no recipient id' });
              })
            }, error => {
              this.err.log(`ImpactPage: Error subscribing to Donation ImpactRecords: ${error.message}`, logTypes.report, logLevels.normal, { error: error, userId: this.userProvider.getUserId() || 'No user Id' });
            })
          })
      }
    }
    else { 
      this.unsubscribeImpactSubscription();
      this.impactSubscription = this.db.getDonationRecords("impact", false, this.userProvider.getOrganizationId())
        .subscribe(donationsAry => {
          this.donations = donationsAry as shareTypes.Impact[];
          // this.donations = theDonations.sort(this.sortDonations);      
        }, error => {
          this.err.log(`ImpactPage: Error subscribing to Recipient ImpactRecords: ${error.message}`, logTypes.report, logLevels.normal, { error: error, userId: this.userProvider.getUserId() || 'No user Id' });
        })
    }
    /* }
        else {
         this.donations = [];
       } */
  }



  public selectionChanged(event) {
    console.log("Selection changed: " + this.showWhichDonations);
    this.updateDonations();
  }

}