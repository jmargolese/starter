import { NativeStorage } from '@ionic-native/native-storage';
import { ErrorReporterProvider, logTypes, logLevels } from './../../share-common/providers/error-reporter/error-reporter';
import { UserProvider } from './../../share-common/providers/user/user';
import { ActivitiesProvider } from './../../share-common/providers/activities/activities';
import { Subscription } from 'rxjs/Subscription';

import { SocialShareProvider } from './../../share-common/providers/social-share/social-share';
import { NotificationsProvider } from './../../share-common/providers/notifications/notifications';
import { Component, ViewChild } from '@angular/core';
import * as constants from '../../share-common/config/constants'
import { ModalController, AlertController } from 'ionic-angular';



import { IonicPage, Tabs, Events, NavController, Platform } from 'ionic-angular'

import * as shareTypes from '../../share-common/interfaces/interfaces';

import { OrganizationProvider } from '../../share-common/providers/organization/organization';
import { AuthProvider } from '../../share-common/providers/auth/auth';
import { AlertProvider } from '../../share-common/providers/alert/alert';

import { ENV } from '@app/env';
import { envApp } from './../../environments/environment.model';


@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('shareTabs') tabRef: Tabs;


  tab1Root = 'MarchPage';
  tab2Root = 'OrgHomePage';
  tab3Root = 'DiscoverPage';
  tab4Root = 'ImpactPage';
  tab5Root = 'SettingsPage';

  public notificationParams: shareTypes.notificationRequestInfo;
  public featuredTabParams: any;
  public favoritesTabParams: any;
  public application: string = "";

  public tab1Title: string = "";
  public tab1Icon: string = "";

  constructor(public events: Events, public notifications: NotificationsProvider,
    public navCtrl: NavController, public platform: Platform, public modalCtrl: ModalController,
    private alertCtrl: AlertController, private socialShare: SocialShareProvider,
    private org: OrganizationProvider, private activitiesProvider: ActivitiesProvider,
    private userProvider: UserProvider, private nativeStorage: NativeStorage,
    private auth: AuthProvider, private err: ErrorReporterProvider,
    private alert: AlertProvider) {

    this.application = ENV.app;
    switch (this.application) {
      case envApp.share:
        this.tab1Root = "OrgHomePage";
        this.tab1Title = "Featured";
        this.tab1Icon = "bulb"
        break;

      case envApp.MFOL:
        this.tab1Root = "MarchPage";
        this.tab1Title = "March";
        this.tab1Icon = "walk"
        break;
      default:
        break;
    }

    this.err.log(`Tabs: constuctor tab1Root = ${this.tab1Root} and this.application: ${this.application}`);

    this.featuredTabParams = { featured: true, orgIndex: 0, notification: null };
    this.favoritesTabParams = { useOrgFavorites: true, orgIndex: 0, notification: null };


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

      this.auth.init();
      this.userProvider.init();            // ensure this get enstantiated  (after a login redirect we'll end up back here)

      this.branchInit();
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



      // Real code
      /*
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

  */


    }) // end platform ready
  }


  private branchInit(): void {
    // only on devices
    if (!this.platform.is('cordova')) { return }

    const Branch = window['Branch'];
    // Branch.setDebug(true);
    Branch.initSession(data => {
      if (data['+clicked_branch_link']) {
        // read deep link data on click

        /*
        {  
  "+is_first_session":true,
  "+clicked_branch_link":true,
  "~marketing":true,
  "+match_guaranteed":false,
  "~id":"486922811043245584",
  "+click_timestamp":1517336872,
  "$one_time_use":false,
  "~referring_link":"https://sharemobile.app.link/cFb3cj5g8J",
  "$__is_onboarding_link":true,
  "$ios_passive_deepview":"branch_passive_default",
  "$marketing_title":"My First Link"
}*/
        this.err.log('Deep Link Data: ' + JSON.stringify(data));

        const notification: shareTypes.notificationRequestInfo = {
          type: data.type || null,
          targetId: data.targetId || null,
          title: data.title || null,
          message: data.message || null,
          //source: "link",
          source: data['+is_first_session'] ? constants.notificationSources.linkFirstInstall : constants.notificationSources.linkNotFirstTime,
          data: {
            campaignCode: data.campaignCode || "",
            channel: data.channel || ""
          }
        }

        this.err.log(`tabs: Deeplink about to publish notification: ${JSON.stringify(notification)}`);
        this.events.publish(constants.EventTypes.pushNotification, notification);
      }

      else {
        // non Branch link is probably a return from webcheckout 
        // data['+non_branch_link']
        // "https://sharemobile.app.link/return?version=1&status=donated&recipientId=orgDesireStreet&activityId=&amount=10.5&displayName=Desire%20Street%20Ministries&errorMessage="
        let result: any = this.parseUri(data['+non_branch_link']);
        this.err.log(`Got a non-branch link which resulted in: ${JSON.stringify(result)}`);
        this.handleDonationReturn(result.queryParams);
      }
    });
  }


  private handleDonationReturn(params) {

    // we are returning from a donation go to the requested organization and thank them

    // Don't post an alert if the donation failed, we already let them know.
    if (!(params.status == 'error')) {
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
              // let organization: shareTypes.Organization;
              let orgSubscription: Subscription = this.org.getOrganization(params.recipientId)
                .subscribe(org => {
                  orgSubscription.unsubscribe();
                  orgSubscription = this.activitiesProvider.getActivity(params.activityId || "")
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
      this.alert.confirm({
        title: "Something went wrong", message: `<p>Unable to complete donation to ${params.displayName}.</p><p>${params.errorMessage}</p>`,
        buttons: { ok: true, cancel: false }
      });

    }

  }

  private subscribeToEvents() {
    // part of the init process
    this.events.subscribe(constants.EventTypes.loginStateChange, (newState: constants.authStateChange) => {
      switch (newState) {
        case constants.authStateChange.logout:
          this.tabRef.select(0);
          break;
        case constants.authStateChange.login:
          this.tabRef.select(1);

        default:
          break;
      }

    });

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
      this.branchInit();
      //this.notifications.getCurrentToken();
      this.events.publish(constants.EventTypes.resumeEvent);
    });


    this.events.subscribe(constants.EventTypes.pushNotification, notification => {
      this.err.log(`tabs:subscribe to pushNotification got a push, about to process ${JSON.stringify(notification)} `);
      this.processNotification(notification);
    });

  }

  private processNotification(notification: shareTypes.notificationRequestInfo): void {

    this.err.log(`tabs:ProcessNotification starting with ${JSON.stringify(notification)}`);
    if (!notification && notification.type) {
      this.err.error(`tabs: processNotification call with null type`);
    } else {
      try {
        switch (notification.type) {
          case constants.notificationTypes.showOrg:
          case constants.notificationTypes.showActivity:
            // go to the featured Tab
            this.featuredTabParams.notification = notification;
            this.err.log(`About to select featured tab for notifiation`);

            const curTab = this.tabRef.getSelected();
            if (curTab.index == 0) {
              this.tabRef.select(1, { animate: false, duration: 0 })
                .then(() => {
                  this.tabRef.select(0, { animate: true })
                    .then(() => {
                      this.featuredTabParams.notification = null;         // clear this out so it only gets signaled once
                    })
                    .catch(error => {
                      this.err.error(`Error calling tabSelect in tabs:processNotification: ${error.message}`);
                    })
                })
            } else {
              this.tabRef.select(0, { animate: true })
                .then(() => {
                  this.featuredTabParams.notification = null;         // clear this out so it only gets signaled once
                })
                .catch(error => {
                  this.err.error(`Error calling tabSelect in tabs:processNotification: ${error.message}`);
                })
            }

            break;

          default:
            this.err.log(`Tabs:processNotification got a notification of a type we don't recognize, ${JSON.stringify(notification)}`, logTypes.report, logLevels.normal, { "notification": notification });
            break;
        }
      } catch (error) {
        this.err.log(`processing a notification in tabs: ${error.message}`, logTypes.error, logLevels.normal, notification);
      }
    }


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

  private showTutorial() {
    const introModal = this.modalCtrl.create('IntroPage');
    introModal.onDidDismiss(data => {
      this.nativeStorage.setItem('didShowIntro', true)
    });
    introModal.present();

  }
  
  ionViewWillLoad() {

    this.platform.ready()
      .then(() => {
        this.err.log("about to check cordova for didShowIntro");
        if (this.platform.is('cordova') && !this.platform.is('tablet')) {
          this.err.log("about to check NativeStorage for didShowIntro");
          this.nativeStorage.getItem('didShowIntro')
            .then(didShowIntro => {
              if (!didShowIntro) this.showTutorial();
            })
            .catch(error => {
              if (error.code == 2) {
                this.showTutorial();
              } else
                this.err.error(`tabs: nativeStorage getting didShowIntro error: ${JSON.stringify(error)}`);
            })
        }
      })

  }
}