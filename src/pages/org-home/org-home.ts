import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { ActivitiesProvider } from '../../share-common/providers/activities/activities';

//import { ActivitiesProvider } from '../../../../common/src/share-common/providers/activities';
import { Component, ViewChild, NgZone, ElementRef, Renderer2 } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content } from 'ionic-angular';


import * as shareTypes from '../../share-common/interfaces/interfaces';
import { UserProvider } from '../../share-common/providers/user/user';

import * as _ from 'lodash';
import * as constants from '../../share-common/config/constants';
import { OrganizationProvider } from '../../share-common/providers/organization/organization';

@IonicPage()
@Component({
  selector: 'page-org-home',
  templateUrl: 'org-home.html',
})
export class OrgHomePage {

  @ViewChild('content') content: Content;
  @ViewChild('navButtons') navButtons;

  public featuredMode: boolean = false;        // are we the 'featured' page showing orgs that are featured (as opposed to favorites)  

  public organization: shareTypes.Organization = null;
  private orgIndex: number;
  public organizationList: shareTypes.Organization[] = null;      // the list of orgs we work with
  public showNextButton: boolean = false;
  public showPrevButton: boolean = false;
  public showNavButtons: boolean = true;

  public showDonateButton: boolean = false;
  public showAddToFavorites: boolean = false;
  public orgMainImageUrl: string = "";

  public currentActivity: shareTypes.Activity = null;
  //public activities: Observable<any> = null;
  private useOrgFavorites: boolean = false;       // should we use a passed in org or get the list of favorites?

  public hideHeader: boolean = true;
  private isVisible: boolean = false;
  private activityListTop: number = null;    // where the activityList will be displayed so we can watch scrolling and know when it's visible
  public loading: boolean = true;

  public isReady: boolean = false;       // don't show anything while loading


  public engageOptions: shareTypes.engageOptions = {
    buttonsToDisplay: {
      socialShare: true,
      addToFavorites: true
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public activitiesProvider: ActivitiesProvider,
    public events: Events, public analytics: AnalyticsProvider, public userProvider: UserProvider, public zone: NgZone,
    public element: ElementRef, public renderer: Renderer2, private org: OrganizationProvider) {


    this.featuredMode = navParams.get('featured') || false;

    this.hideHeader = navParams.get('showHeader') ? false : true;
    this.useOrgFavorites = navParams.get('useOrgFavorites') || false;

    this.events.subscribe("activity:homeCurrentActivity", (activity) => {
      // let other parts of the app tell us when a new tab is needed   
      this.currentActivity = activity;
    });

    this.events.subscribe(constants.EventTypes.userUpdated, user => {
      // if we are displayed in featured view, then we don't worry about changes to favorites
      console.log("User status updated in org-home page");
      if (this.isVisible) {       // only do this check if we are visible rather than cached
        this.recheckOrganizationList();
      }
    });


    // in case someone presses 'remove from home' we have to respond
    this.events.subscribe(constants.EventTypes.actionButtonComplete, data => {

      // if we are displayed in featured view, then we don't worry about changes to favorites
      if (!this.featuredMode && data.type == "addToFavorites" && this.isVisible) {       // only do this check if we are visible rather than cached
        this.recheckOrganizationList();
      }

    })

    this.showDonateButton = false;

    this.events.subscribe(constants.EventTypes.orgHomeActivityListPosition, data => {
      this.activityListTop = data.position;
    });


  }

  ionViewWillEnter() {

    this.loading = true;


    this.isVisible = true;
    this.analytics.setCurrentScreen('org-Home');

    this.userProvider.isAuthenticated()
      .then(() => {
        // this page is used in multiple ways
        // 1- From Discover page, just display a single organiziation passed in navParams (and set in this.setOrganization())
        // 2- We are part of a sequence of 'favorites' where we get an index into the organizationFavorites array
        // 3- We are part of a sequence of 'featured' organizations where we get an index into the featuredOrganizations array

        // if we are part of the favorites display, we are passed an index and just grab the organization in the index
        if (this.useOrgFavorites || this.featuredMode)
          this.orgIndex = this.navParams.get('orgIndex') || 0;

        if (this.featuredMode) {
          this.org.getFeaturedOrganizations()
            .subscribe(featuredOrgs => {
              this.organizationList = featuredOrgs;
              this.setOrganization(this.orgIndex || 0);
              this.loading = false;
            }, error => {
              console.error("Error in org-home calling getFeaturedOrganizations: " + error.message);
              this.organizationList = [];
              this.setOrganization(this.orgIndex || 0);
              this.loading = false;
            });

        } else {
          this.useOrgFavorites = this.navParams.get('useOrgFavorites') ? true : false;
          // this means we are part of a list of organization favorites with an index, as opposed to be being passed in an organization


          this.setOrganization(this.orgIndex || 0);
          this.loading = false;
        }



      })
      .catch(error => {
        console.error("org-homePage ionViewWillEnter error from isAuthenticated(): " + error.message);
        this.loading = false;
      })



  }

  private determineIndex(): number {
    let index: number = this.orgIndex;
    let requestedOrg = this.navParams.get('showOrg') || null;
    if (requestedOrg) {
      index = _.findIndex(this.organizationList, ['active', false]);
      index = index < 0 ? this.orgIndex : 0;       // in case the requested org wasn't in the list for some reason
    }
    return index;
  }

  private recheckOrganizationList() {
    // a user may have added or removed favorite orgs, make sure we (the org displayed on this page) is still in the favorites, 
    // if not, take action to remove us from view
    // we need to see if our organization still is in the favorites list.
    if (this.useOrgFavorites) {
      this.organizationList = this.userProvider.getFavoriteOrganizations();

      if (this.organization && !_.find(this.organizationList, ['id', this.org.getId(this.organization)])) {
        // the organization we are displaying was removed from the list, so:
        if (this.orgIndex == 0) {
          if (this.organizationList.length) {
            // we are the root and there is at least one more, so change our identity
            this.setOrganization(0);
            this.content.scrollToTop(200);
          } else {
            // we are the last so just display the 'get more favorites message'

            this.setOrganization(0);
          }
        }
        else {
          // if we are up in the stack, just pop.
          this.prev();
        }
      }
    }
  }

  public setOrganization(orgIndex: number) {

    if (this.useOrgFavorites || this.featuredMode) {

      if (this.useOrgFavorites)
        // userProvider downloads favorite organizations on setup

        this.organizationList = this.userProvider.getFavoriteOrganizations();

      if (this.organizationList && this.organizationList.length) {
        orgIndex = this.determineIndex();        // we may have been told to go a specific org and we can't check the list until now
        this.hideHeader = true;
        this.showNavButtons = true;
        this.showAddToFavorites = false;

        this.organization = this.organizationList[orgIndex];
        this.showPrevButton = orgIndex > 0;
        this.showNextButton = orgIndex < this.organizationList.length - 1;
      } else {
        this.organization = null;
        this.showNextButton = this.showPrevButton = false;
      }
    } else {
      this.organization = this.navParams.get('organization') || null;
      this.showAddToFavorites = this.organization && this.userProvider.userLikesOrganization(this.org.getId(this.organization)) ? false : true;
    }

    if (this.organization) {
      this.showDonateButton = true;
      this.orgMainImageUrl = this.org.getImageUrl(this.organization, constants.imageTypes.organizationImage, constants.imageSizes.reduced);
    } else {
      this.showDonateButton = false;
      this.orgMainImageUrl = "";
    }
    //this.testMe.testMe();  
    console.log('ionViewDidLoad OrgHomePage and showAddToFavorites is: ' + this.showAddToFavorites);
    this.isReady = true;
  }



  public swipeEvent(event) {

    switch (event.direction) {
      case 2:
        this.next();
        break;
      case 4:
        this.prev();
      default:
        break;
    }


  }

  public next() {
    if (this.orgIndex < this.organizationList.length - 1) {
      this.navCtrl.push('OrgHomePage', { useOrgFavorites: true, orgIndex: this.orgIndex + 1, featured: this.featuredMode })
    }
  }

  public prev() {
    console.log("org-home page about to pop in prev");
    this.navCtrl.pop();
  }


  ngAfterViewInit() {


  }
  ionViewWillLeave() {
    this.isVisible = false;
    this.showDonateButton = false;
    this.showAddToFavorites = false;
  }

  ionViewDidLoad() {

    this.content.ionScroll.subscribe((data) => {
      // console.log('Scroll event: ' + data.scrollTop + " and activityListTop: " + this.activityListTop);
      const buffer = 70;

      this.zone.run(() => {
        // since scrollAmount is data-binded,
        // the update needs to happen in zone
        if (data.scrollTop > buffer && this.navButtons) {
          // as the user scrolls up, the nav buttons disappear, slowly
          this.renderer.setStyle(this.navButtons.nativeElement, "top", -(data.scrollTop - buffer) / 2 + "px");
        }

        this.showDonateButton = this.organization && (data.scrollTop < this.activityListTop);

      })

    })

  }

}
