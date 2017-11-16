import { Organization } from './home';
import { AnalyticsProvider } from './../../share-common/providers/analytics/analytics';
import { UserProvider } from './../../share-common/providers/user/user';
import { Component, ViewChild, ViewChildren, QueryList, NgZone } from '@angular/core';

import { IonicPage, NavController, NavParams, Slides, Content, LoadingController, Events } from 'ionic-angular';
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
  public currentActivity: shareTypes.Activity;

  public showNextButton: boolean = false;
  public showPrevButton: boolean = false;
  public showShareButton: boolean = true;
  public showNavButtons: boolean = true;
  public showDonateButton: boolean = false;
  private subscribedToSlideChanges: boolean = false;
  public orgsAreValid: boolean = false;


  private loading;


  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider,
    public analytics: AnalyticsProvider, public zone: NgZone, public loadingCtrl: LoadingController,
    public events: Events) {

    this.events.subscribe("activity:homeCurrentActivity", (activity) => {
      // let other parts of the app tell us when a new tab is needed
      this.currentActivity = activity;
    });

    this.events.subscribe('action-button:complete', data => {
      console.log("in homePage got event that action button completed: " + data.type);
      if (data.type == "addToHome") {
        this.organizations = null;
        this.getFavoriteOrganizations();
      }

    })
  }

  public onSearchInput(event: any): void {

    //let val = event.target.value;

    //console.log("onSearchInput called with:  " + val);
  }

  private getFavoriteOrganizations() {

    // make the call regardless so that we are tracking the observable in case we do login

    /* this.organizations$ = this.userProvider.getFavoriteOrganizations();

    this.organizations$.subscribe(docs => {
       console.log("in homePage: organizations changed:");
      // try to avoid an error in slides if you remove a slide, so clear it first
      if (this.organizations && this.organizations.length && docs && (docs.length != this.organizations.length))
        this.organizations = null;

      this.organizations = docs;
      console.log("In home.ts subscribe returned: " + (docs ? docs.length : "no docs"));
      setTimeout(() => {

        this.updateNavButtons(500);
        this.subscribeToSlideChanges();
        if (this.loading) {
          this.loading.dismiss().catch()
        }
      
      }, 250)

    }) */
  }


  ionViewWillEnter() {
    console.log("Entering home.ts");
    this.loading = this.loadingCtrl.create({
      content: ''
    });
   /*  this.loading.present()
      .then(() => {
        this.currentOrganization = null;
        this.orgsAreValid = false;

        // ensure we've completed our login check before trying to load anything
        this.userProvider.isAuthenticated()
          .then((isAuthenticated) => {
            console.log("in home.ts ionViewWillEnter are we authenticated? " + isAuthenticated);
            this.getFavoriteOrganizations();

          })
      }) */


  }

  ionViewDidEnter() {
    this.analytics.setCurrentScreen('Dashboard');
  }



  ngAfterViewInit() {
    //https://stackoverflow.com/questions/37087864/execute-a-function-when-ngfor-finished-in-angular-2

    this.activeOrgs.changes.subscribe(item => {
      console.log("got a change in activeOrgs: ");
      this.updateNavButtons(400);

    });


    this.content.ionScroll.subscribe((data) => {
     //  console.log('Scroll event: ' + data.scrollTop);
      this.zone.run(() => {
        // since scrollAmount is data-binded,
        // the update needs to happen in zone
        this.showNavButtons = (data.scrollTop < 40);
       // console.log("this.showNavButtons: " + this.showNavButtons);
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
    // when slide changes (Swipe) we have to update what is current organization
    if (this.slides && this.organizations && this.organizations.length) {
     
     let indx: number = this.slides.getActiveIndex();
     if (typeof indx != 'undefined') {
        this.currentOrganization = this.organizations[this.slides.getActiveIndex()];
        console.log("Active index: " + this.slides.getActiveIndex() , 'and length', this.slides.length());
        console.log("Changed current organization to: " + this.currentOrganization.companyName);
     
     }
      
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
        try {   // there is a bug in slides when things are changing fast, just catch the error
          this.showDonateButton =  this.slides && this.slides.length() ? true : false;
        } catch (error) {
          this.showDonateButton = false;
        }
       
      } else {
        this.showDonateButton = false;
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
