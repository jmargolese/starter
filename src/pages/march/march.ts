import { MarchProvider } from './../../share-common/providers/march/march';
import { AnalyticsProvider } from './../../share-common/providers/analytics/analytics';
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

import * as shareTypes from './../../share-common/interfaces/interfaces';
import { ErrorReporterProvider } from './../../share-common/providers/error-reporter/error-reporter';

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
  public eventList: shareTypes.marchEvent[];

  constructor(private err: ErrorReporterProvider, private analytics: AnalyticsProvider, private march: MarchProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MarchPage');
  }

  ionViewWillEnter() {

    this.loading = true;
    this.err.recordBreadcrumb({ message: 'Entering page March' });

    this.analytics.setCurrentScreen('march');

    this.march.getMarchInfo()
      .then((eventList) => {
        this.eventList = eventList;
        this.loading = false;

        this.isReady = true;
      })

  }

}
