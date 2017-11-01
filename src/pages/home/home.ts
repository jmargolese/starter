import { UserProvider } from './../../share-common-providers/user/user';
import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';

import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';



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

  @ViewChild(Slides) slides: Slides;

  @ViewChildren('orgSlides') activeOrgs: QueryList<any>;
  public organizations$: Observable<any[]>;
  

  public showNextButton: boolean = false;
  public showPrevButton: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider) {


  }

  public onSearchInput(event: any): void {

    //let val = event.target.value;

    //console.log("onSearchInput called with:  " + val);
  }

  ionViewWillEnter() {
    console.log("Entering home.ts");
    // ensure we've completed our login check before trying to load anything
    this.userProvider.isAuthenticated()
      .then((isAuthenticated) => {
        console.log("in home.ts ionViewWillEnter are we authenticated? " + isAuthenticated);
        // make the call regardless so that we are tracking the observable in case we do login

        this.organizations$ = this.userProvider.getFavoriteOrganizations();

         this.organizations$.subscribe(docs => {
          console.log("In home.ts subcribe returned: " + (docs ? docs.length : "no docs"));
          setTimeout(() => {
            this.updateNavButtons(500);
          },250) 
       
        }) 

      })
   
  }

  ngAfterViewInit() {
    //https://stackoverflow.com/questions/37087864/execute-a-function-when-ngfor-finished-in-angular-2
   
    this.activeOrgs.changes.subscribe(item => {
      console.log("got a change in activeOrgs");
      this.updateNavButtons(200);
    })
  }

  ionViewDidLoad() {
  }

  public slideChanged() {

    this.updateNavButtons(0);
  }
 

  public updateNavButtons(delay:number) {
    if (this.slides) {
      setTimeout(() => {
        this.showNextButton = !this.slides.isEnd();
        this.showPrevButton = !this.slides.isBeginning();
      },delay)
      
    }
  }

  public next() {
    this.slides.slideNext();
  }
  public prev() {
    this.slides.slidePrev();
  }

}
