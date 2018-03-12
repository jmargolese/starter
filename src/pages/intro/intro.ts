import { ErrorReporterProvider } from './../../share-common/providers/error-reporter/error-reporter';
import { AnalyticsProvider } from './../../share-common/providers/analytics/analytics';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {
  public buttonText: string = "Next";
  public showDoneButton: boolean = false;

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams,private err: ErrorReporterProvider,
    private viewCtrl: ViewController, private analytics: AnalyticsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
    if ( this.navParams.get('userRequested')) {
      this.err.log(`IntroPage: User requested to view tutorial`);
      this.analytics.setCurrentScreen('intro')
      this.analytics.logEvent('intro', {userRequested: true})
    }
  }

  next() {
    if (this.slides.isEnd()) {
      this.viewCtrl.dismiss()
        .catch(() => { })
    } else {
      this.slides.slideNext();
    }

  }

  slideChanged() {
    if (this.slides.isEnd()) {
      this.buttonText = "Close";
      this.showDoneButton = true;
    } else {
      this.showDoneButton = false;
    }


  }

}
