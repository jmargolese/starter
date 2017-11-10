import { AnalyticsProvider } from './../../share-common/providers/analytics/analytics';
import { UserProvider } from './../../share-common/providers/user/user';
import { Component, ViewChild, ViewChildren, QueryList, NgZone } from '@angular/core';

import { IonicPage, NavController, NavParams, Slides, Content} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { setTimeout } from 'timers';




/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface Organization { };

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  @ViewChild('orgSlides') slides: Slides;

  @ViewChildren('orgSlide') activeOrgs: QueryList<any>;

  @ViewChild('content') content: Content;

  public organizations$: Observable<any[]>;


  public showNextButton: boolean = false;
  public showPrevButton: boolean = false;
  public showShareButton: boolean = true;
  public showNavButtons: boolean = true;
  private subscribedToSlideChanges: boolean = false;
  public thereAreNoOrgs: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider, 
    public analytics: AnalyticsProvider, public zone: NgZone) {


  }

  public onSearchInput(event: any): void {

    //let val = event.target.value;

    //console.log("onSearchInput called with:  " + val);
  }

 
  ionViewWillEnter() {
    console.log("Entering home.ts");
   
    this.thereAreNoOrgs = true;

    // ensure we've completed our login check before trying to load anything
    this.userProvider.isAuthenticated()
      .then((isAuthenticated) => {
    
        console.log("in home.ts ionViewWillEnter are we authenticated? " + isAuthenticated);
        // make the call regardless so that we are tracking the observable in case we do login

        this.organizations$ = this.userProvider.getFavoriteOrganizations();

        this.organizations$.subscribe(docs => {
          this.thereAreNoOrgs = !docs || docs.length == 0 ? true : false;
          console.log("In home.ts subscribe returned: " + (docs ? docs.length : "no docs"));
          setTimeout(() => {

            this.updateNavButtons(500);
            this.subscribeToSlideChanges();
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
      this.updateNavButtons(200);
    });

    
    this.content.ionScroll.subscribe((data) => {
      //console.log('Scroll event: ' + data.scrollTop);
      this.zone.run(()=>{
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
      }
    }, 500);

  }

  public slideChanged() {

    this.updateNavButtons(0);
  }


  public updateNavButtons(delay: number) {

    setTimeout(() => {
      if (this.slides) {
        this.showNextButton = !this.slides.isEnd();
        this.showPrevButton = !this.slides.isBeginning();
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
