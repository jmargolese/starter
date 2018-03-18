import { Subscription } from 'rxjs/Subscription';
import { NavController, Searchbar } from 'ionic-angular/index';
import { OrganizationProvider } from './../../share-common/providers/organization/organization';
import { MarchProvider } from './../../share-common/providers/march/march';
import { AnalyticsProvider } from './../../share-common/providers/analytics/analytics';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, Content } from 'ionic-angular';

import * as shareTypes from './../../share-common/interfaces/interfaces';
import { ErrorReporterProvider, logTypes, logLevels } from './../../share-common/providers/error-reporter/error-reporter';
import * as _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-march',
  templateUrl: 'march.html',
})
export class MarchPage {

  @ViewChild('content') content: Content;
  @ViewChild('searchBar') searchBar: Searchbar;

  public organization: shareTypes.Organization = null;     // if there is a selected march
  public useSelectedMarch: boolean = false;
  public loading: boolean = true;
  public isReady: boolean = false;
  public showDonateButton: boolean = false;
  public completeEventList: shareTypes.Organization[];
  public eventList: shareTypes.Organization[];
  private allOrgSubscription: Subscription = null;

  private notificationRequest: shareTypes.notificationRequestInfo = null;

  constructor(private err: ErrorReporterProvider,
    private analytics: AnalyticsProvider, private march: MarchProvider, private org: OrganizationProvider,
    private navCtrl: NavController, private navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MarchPage');
   
  }

  ionViewWillEnter() {

    this.scrollTo('content');
    this.searchBar.clearInput(null);
    this.filterList(null);
    
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
            this.err.log(`MarchPage: ionviewWillEnter error getting org for notification: ${error.message}`, logTypes.report, logLevels.normal, { error: error, notification: this.notificationRequest });

          })
      }
    }

  
    this.unsubscribeAllOrgSubscription();
    this.allOrgSubscription = this.org.getAllOrganizations(true, false, true, false)
      .subscribe(organizations => {
        this.completeEventList = organizations.filter(org => {
          return org.companyName.toLowerCase().indexOf('march') >= 0 || org.info.march;
        });
        this.completeEventList = _.sortBy(this.completeEventList, ['additionalData.state']);
        this.eventList = this.completeEventList;
      }, error => {
        this.err.log(`MarchPage: Error subscribing to all organizations ${error.message}`, logTypes.report, logLevels.normal, {error: error, eventList: this.eventList});
        
      })

    //this.eventList = eventList;
    this.loading = false;

    this.isReady = true;


  }

  ionViewWillUnload(){
    this.unsubscribeAllOrgSubscription();
  }

  private unsubscribeAllOrgSubscription() {
    try {
      if (this.allOrgSubscription) {
        this.allOrgSubscription.unsubscribe();
      }
    } catch (error) {
      // just catch if there's an error
    }
  }

  private scrollTo(element: string) {
    let target: number = 20;
    const domElement = document.getElementById(element);
    if (domElement) {
      let yOffset = document.getElementById(element).offsetTop;
      this.content.scrollTo(0, yOffset, target)
    }
  }

  public filterList(event: any) {
    let val = event && event.target.value ? event.target.value.toLowerCase() : null;

    if (!val) {
      this.eventList = this.completeEventList;

      this.scrollTo('content');
    }
    else {

      this.eventList = this.completeEventList
        .filter(event => {
          const state: string = (event.additionalData && event.additionalData.state) ? event.additionalData.state.toLowerCase() : "";
          const city: string = event.companyName.toLowerCase().replace('march for our lives','').replace('mfol','');

          return (state.indexOf(val) >= 0) || (city.indexOf(val)) >= 0 ? true : false
        })
        
      if (this.eventList.length)
        this.scrollTo(this.eventList[0].metadata.id)
      else
        this.scrollTo('content');
    }
  }

  public showEvent(organization: shareTypes.Organization) {
    this.analytics.logEvent('select_march', { companyName: organization.companyName, id: organization.metadata.id });
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
