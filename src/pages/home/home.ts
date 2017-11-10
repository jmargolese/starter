import { Organization } from './home';
import { AnalyticsProvider } from './../../share-common/providers/analytics/analytics';
import { UserProvider } from './../../share-common/providers/user/user';
import { Component, ViewChild, ViewChildren, QueryList, NgZone } from '@angular/core';

import { IonicPage, NavController, NavParams, Slides, Content, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { setTimeout } from 'timers';


import * as shareTypes from '../../share-common/interfaces/interfaces';


export interface Organization { };

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('orgSlides') slides: Slides;

  @ViewChildren('orgSlide') activeOrgs: QueryList<any>;

  @ViewChild('content') content: Content;

  public organizations$: Observable<any[]>;
  public organizations: shareTypes.Organization[];
  public currentOrganization: shareTypes.Organization;

  public showNextButton: boolean = false;
  public showPrevButton: boolean = false;
  public showShareButton: boolean = true;
  public showNavButtons: boolean = true;
  private subscribedToSlideChanges: boolean = false;
  public orgsAreValid: boolean = false;

  private loading;


  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider,
    public analytics: AnalyticsProvider, public zone: NgZone, public loadingCtrl: LoadingController) {


  }

  public onSearchInput(event: any): void {

    //let val = event.target.value;

    //console.log("onSearchInput called with:  " + val);
  }


  ionViewWillEnter() {
    console.log("Entering home.ts");
    this.loading = this.loadingCtrl.create({
      content: ''
    });
    this.loading.present();
    this.currentOrganization = null;
    this.orgsAreValid = false;

    // ensure we've completed our login check before trying to load anything
    this.userProvider.isAuthenticated()
      .then((isAuthenticated) => {

        console.log("in home.ts ionViewWillEnter are we authenticated? " + isAuthenticated);
        // make the call regardless so that we are tracking the observable in case we do login

        this.organizations$ = this.userProvider.getFavoriteOrganizations();

        this.organizations$.subscribe(docs => {

          this.organizations = docs;
          console.log("In home.ts subscribe returned: " + (docs ? docs.length : "no docs"));
          setTimeout(() => {

            this.updateNavButtons(500);
            this.subscribeToSlideChanges();
            this.loading.dismiss();
          }, 250)

        })

      })

  }

  ionViewDidEnter() {
    this.analytics.setCurrentScreen('BrowsePage');
  }



  ngAfterViewInit() {
    //https://stackoverflow.com/questions/37087864/execute-a-function-when-ngfor-finished-in-angular-2

    this.activeOrgs.changes.subscribe(item => {
      console.log("got a change in activeOrgs");
      this.updateNavButtons(400);

    });


    this.content.ionScroll.subscribe((data) => {
      //console.log('Scroll event: ' + data.scrollTop);
      this.zone.run(() => {
        // since scrollAmount is data-binded,
        // the update needs to happen in zone
        this.showNavButtons = (data.scrollTop < 40);
      })

    })


  }

  ionViewDidLoad() {

  }

  public subscribeToSlideChanges() {

    setTimeout(() => {

      if (!this.subscribedToSlideChanges && this.slides) {

        this.slides.ionSlideProgress.subscribe(event => {

          this.showShareButton = (event % 1 < 0.2) ? true : false;  // show the button until we're about 20% gone

          //console.log("Slide did progres: " + event + " showShareButton: " + this.showShareButton);
        });

        this.slides.ionSlideDidChange.subscribe(event => {
          this.updateCurrentOrganization();
        });
      }
    }, 500);

  }

  private updateCurrentOrganization() {
    if (this.slides && this.organizations && this.organizations.length) {
      this.currentOrganization = this.organizations[this.slides.getActiveIndex()];
      console.log("Changed current organization to: " + this.currentOrganization.companyName);
    }
  }

  public slideChanged() {

    this.updateNavButtons(0);
  }


  public updateNavButtons(delay: number) {

    setTimeout(() => {
      this.orgsAreValid = true;      /// this is to get a delay so we are sure things are valid
      if (this.slides) {
        this.showNextButton = !this.slides.isEnd();
        this.showPrevButton = !this.slides.isBeginning();
        this.updateCurrentOrganization();
      }
    }, delay)


  }

  public next() {
    this.slides.slideNext();
  }
  public prev() {
    this.slides.slidePrev();
  }

}
