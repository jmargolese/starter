import { UserProvider } from './../../share-common/providers/user/user';
import { ActivitiesProvider } from './../../share-common/providers/activities/activities';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { SocialShareProvider } from './../../share-common/providers/social-share/social-share';
import { NotificationsProvider } from './../../share-common/providers/notifications/notifications';
import { Component, ViewChild } from '@angular/core';
import { Deeplinks } from '@ionic-native/deeplinks';
import { ENV } from '@app/env';
import * as constants from '../../share-common/config/constants'
import { ModalController, AlertController, ToastController } from 'ionic-angular';



import { IonicPage, Tabs, Events, NavController, Platform } from 'ionic-angular'

import * as shareTypes from '../../share-common/interfaces/interfaces';

import { OrganizationProvider } from '../../share-common/providers/organization/organization';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { AuthProvider } from '../../share-common/providers/auth/auth';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('shareTabs') tabRef: Tabs;

  tab1Root = "OrgHomePage";
  tab2Root = 'OrgHomePage';
  tab3Root = 'DiscoverPage';
  tab4Root = 'SettingsPage';
  tab5Root = 'ImpactPage';


  constructor(public events: Events, public deeplinks: Deeplinks, public notifications: NotificationsProvider,
    public navCtrl: NavController, public platform: Platform, public modalCtrl: ModalController,
    private alertCtrl: AlertController, private socialShare: SocialShareProvider,
    private org: OrganizationProvider, private activitiesProvider: ActivitiesProvider,
    private toastCtrl: ToastController, private userProvider: UserProvider,
    private auth: AuthProvider) {




    this.subscribeToEvents();

    console.log("setting up deeplinks in tabs");


    this.platform.ready().then(() => {

      this.notifications.init();

      /*
      IonicDeeplink.route({
        '/about-us': AboutPage,
        '/universal-links-test': AboutPage,
        '/products/:productId': ProductPage
      }, function(match) {
        // Handle the route manually
      }, function(nomatch) {
        // No match
      })
      */

      /*
      Successfully routed {"$link":{"path":"/crwp","queryString":"","fragment":"","host":"nn4wp.app.goo.gl","url":"https://nn4wp.app.goo.gl/crwp","scheme":"https"}}
      */
      console.log("Environment is: " + ENV.mode);
      this.auth.init();
      this.userProvider.init();            // ensure this get enstantiated  (after a login redirect we'll end up back here)

      /*
            this.deeplinks.route({
              '/settings': 'SettingsPage',
      
              '/return': 'DiscoverPage'
            }).subscribe((match) => {
              // match.$route - the route we matched, which is the matched entry from the arguments to route()
              // match.$args - the args passed in the link
              // match.$link - the full link data
              console.log('Successfully routed route:' + match.$route, JSON.stringify(match));
      
              //var result: any = this.parseUri( match.url.$link);
              //console.log("Parsed URI looks like: " + JSON.stringify(result.queryParams));
              if (match.$args) {
                console.log("Args are: " + JSON.stringify(match.$args));
              }
            }, (nomatch) => {
              // nomatch.$link - the full link data
              console.error('Got a deeplink that didn\'t match', JSON.stringify(nomatch));
            });
      
      */
      // Convenience to route with a given nav
      this.deeplinks.routeWithNavController(this.navCtrl, {
        '/settings': 'SettingsPage',
        //'/universal-links-test': DiscoverPage,
        '/fred': 'DiscoverPage'
      }).subscribe((match: any) => {
        console.log('Successfully routed route:' + match.$route, JSON.stringify(match));


        if (match.$args) {
          console.log("Args are: " + JSON.stringify(match.$args));
        }
        else {
          var result: any = this.parseUri(match.$link.url);
          console.log("Parsed URI looks like: " + JSON.stringify(result.queryParams));
        }

        switch (match.$link.host) {
          case "/return":
          case "return":
            // coming back from a donation
            this.handleDonationReturn(result.queryParams);

            break;

          default:
            break;
        }
      }, (nomatch) => {
        console.warn('Unmatched Route', JSON.stringify(nomatch));
      });




    }) // end platform ready
  }


  private handleDonationReturn(params) {

    // we are returning from a donation go to the requested organization and thank them

    // Don't post an alert if the donation failed, we already let them know.
    if(!(params.status == 'error')){
      //this.tabRef.select(1);
      let thankYouMsg: string = `Thank you for your generous donation to ${params.displayName}`;
      // this.alertCtrl.confirm({title: "Thank you", message: thankYouMsg, buttons: { ok: true, cancel: false}});

      let alert = this.alertCtrl.create({
        title: 'Thank you!',
        message: thankYouMsg,
        buttons: [

          {
            text: 'Share with friends',
            cssClass: 'share-alert-button',
            handler: () => {
              let organization: shareTypes.Organization;
              let orgSubscription: Subscription = this.org.getOrganization(params.recipientId)
                .subscribe(org => {
                  orgSubscription.unsubscribe();
                  orgSubscription = this.activitiesProvider.getActivity( params.activityId || "")
                    .subscribe(activity => {
                      orgSubscription.unsubscribe();
                      this.socialShare.startSocialShare(org, activity);
                    }, error => {
                      console.error("Error getting org in tabs:handleDonationReturn: " + error.message);

                    }, () => {
                      // we will end up here if there is no activity
                      this.socialShare.startSocialShare(org);
                    })
                }, error => {
                  console.error("Error getting org in tabs:handleDonationReturn: " + error.message);
                });
            }
          },
          {
            text: 'OK',
            role: 'cancel',
            handler: () => {
              console.log('Ok => Cancel clicked');
            }
          }
        ]
      });
      alert.present();

      } else { // donation failed. reiterate.
          let toast = this.toastCtrl.create({
            message: `Unable to complete donation to ${params.displayName}\n${params.errorMessage}`,
            duration: 5000,
            position: 'top'
          });

          toast.onDidDismiss(() => {
            console.log('Dismissed toast - donation failed.');
          });

          toast.present();
      }

  }

  private subscribeToEvents() {
    // part of the init process
    this.events.subscribe('tabs:select', (newTab) => {
      // let other parts of the app tell us when a new tab is needed
      this.tabRef.select(newTab);

    });

    this.events.subscribe(constants.EventTypes.modalAddPayMethodPage, () => {

      this.showAddStripeCCModal();

    });

    /*  this.events.subscribe('user:updated', () => {
       
       
   
     }); */

    this.platform.resume.subscribe(() => {
      console.log("Resume event");
      //this.notifications.getCurrentToken();
      this.events.publish(constants.EventTypes.resumeEvent);
    });

  }

  /*
    * See: https://gist.github.com/1847816
    * Parse a URI, returning an object similar to Location
    * Usage: var uri = parseUri("hello?search#hash")
    */
  public parseUri(url) {

    var result: any = {};
    try {
      var anchor = document.createElement('a');
      anchor.href = url;

      /*  host: "return"
       
       hostname: "return"
       
       href: "getshare://return?amount=0&displayName=Chad+Tough&errorMsg=Error+sending+the+donation&recipientId=0&status=error&version=1"
       
       pathname: ""
       
       port: ""
       
       protocol: "getshare:"
       
       requestUri: "?amount=0&displayName=Chad+Tough&errorMsg=Error+sending+the+donation&recipientId=0&status=error&version=1"
       
       search: "?amount=0&displayName=Chad+Tough&errorMsg=Error+sending+the+donation&recipientId=0&status=error&version=1" */
      var keys = 'protocol hostname host pathname port search hash href'.split(' ');
      for (var keyIndex in keys) {
        var currentKey = keys[keyIndex];
        result[currentKey] = anchor[currentKey];
      }

      result.toString = function () { return anchor.href; };
      result.requestUri = result.pathname + result.search;


      // var search = result.search;
      var search = result.search.slice(1).replace(/\+/g, " ");  //slice(1) to remove leading "?", then remove '+' signs from URL encoding
      // https://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object
      result.queryParams = search ? JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
        function (key, value) { return key === "" ? value : decodeURIComponent(value) }) : {}



    } catch (error) {
      console.error("Error in parseURI: " + JSON.stringify(error));
    }


    return result;

  }

  public showAddStripeCCModal() {
    const addPayMethod = this.modalCtrl.create('AddStripeCcPage');
    addPayMethod.onDidDismiss(data => {
      if (data.canceled) {
        var error: any = new Error('User canceled');
        error.canceled = true;
        this.events.publish(constants.EventTypes.modalDismissedAddPayMethodsPage, { canceled: true })
      } else

        this.events.publish(constants.EventTypes.modalDismissedAddPayMethodsPage, { data: data.newPaymethod })
    });
    addPayMethod.present();
  }


  ionViewDidEnter() {
    //this.tabRef.select(1);
  }

  ionViewDidLoad() {

  }
}