import { NavController } from 'ionic-angular/index';
import { OrganizationProvider } from './../../share-common/providers/organization/organization';
import { MarchProvider } from './../../share-common/providers/march/march';
import { AnalyticsProvider } from './../../share-common/providers/analytics/analytics';
import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

import * as shareTypes from './../../share-common/interfaces/interfaces';
import { ErrorReporterProvider, logTypes, logLevels } from './../../share-common/providers/error-reporter/error-reporter';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-march',
  templateUrl: 'march.html',
})
export class MarchPage {

  public organization: shareTypes.Organization = null;     // if there is a selected march
  public useSelectedMarch: boolean = false;
  public loading: boolean = true;
  public isReady: boolean = false;
  public showDonateButton: boolean = false;
  public completeEventList: shareTypes.Organization[];
  public eventList: shareTypes.Organization[];

  private notificationRequest: shareTypes.notificationRequestInfo = null;

  constructor(private err: ErrorReporterProvider,
    private analytics: AnalyticsProvider, private march: MarchProvider, private org: OrganizationProvider,
    private navCtrl: NavController, private navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MarchPage');
  }

  ionViewWillEnter() {

    this.loading = true;
    this.err.recordBreadcrumb({ message: 'Entering page March' });

    this.analytics.setCurrentScreen('march');
    
   
      this.notificationRequest = this.navParams.get('notification') || null;
      if (this.notificationRequest) {
        this.err.log(`MarchPage: ionViewwillenter got a notification request: ${JSON.stringify(this.notificationRequest)}`);
        if (this.notificationRequest.targetId) {
          this.org.getOrganizationAsPromise(this.notificationRequest.targetId)
          .then(org => {
            this.showEvent(org);
          })
          .catch(error => {
            this.err.log(`MarchPage: ionviewWillEnter error getting org for notification: ${error.message}`, logTypes.report, logLevels.normal,{error: error, notification: this.notificationRequest});

          })
        }
      }
    

    this.org.getAllOrganizations(true)
      .subscribe(organizations => {
        this.completeEventList = organizations.filter(org => org.companyName.toLowerCase().indexOf('march') >= 0);
        this.completeEventList = _.sortBy(this.completeEventList, ['additionalData.state']);
        this.eventList = this.completeEventList;
      })

    //this.eventList = eventList;
    this.loading = false;

    this.isReady = true;


  }

  public filterList(event: any) {
    let val = event.target.value ? event.target.value.toLowerCase() : null;

    if (!val)
      this.eventList = this.completeEventList
    else {
     
        this.eventList = this.completeEventList
          .filter(event => { 
            return event.additionalData && event.additionalData.state ? (event.additionalData.state.toLowerCase().indexOf(val) >= 0) : false })
    
    }
  }

  public showEvent(organization: shareTypes.Organization) {
    this.navCtrl.push('OrgHomePage', { organization: organization, showHeader: true })
  }

  public changeLocation() {
    //this.march.askForPostalCode(true)
    //.then(postalCode => {
    this.march.getAllPages()
      .then((eventList) => {
        this.err.log('marchPage: getAllPages resolved');
      });
    // })
  }

}
