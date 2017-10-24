import { BrowsePage } from './../browse/browse';
import { DashboardPage } from './../dashboard/dashboard';
import { SettingsPage } from './../settings/settings';
import { AuthProvider } from './../../providers/auth/auth';
import { Component, ViewChild } from '@angular/core';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links';
import { Deeplinks } from '@ionic-native/deeplinks';

import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

import { Tabs, Events, NavController, Platform } from 'ionic-angular'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('shareTabs') tabRef: Tabs;

  tab1Root = HomePage;
  tab2Root = BrowsePage;
  tab3Root = SettingsPage;
  tab4Root = DashboardPage;
  tab5Root = ContactPage;

  constructor(private authProvider: AuthProvider, public events: Events, public deeplinks: Deeplinks, public navCtrl: NavController, public platform: Platform) {
    events.subscribe('tabs:select', (newTab) => {
      // let other parts of the app tell us when a new tab is needed
      this.tabRef.select(newTab);

    });

    authProvider.getUser();       // just trigger it to init

    console.log("setting up deeplinks in tabs");
    /*  this.fdl.onDynamicLink()
     .then(res => {
       console.log("got a dynamic link: " +JSON.stringify(res));
     })
     .catch(error => {
       console.error('in tabs:onDynamicLink got an error: ' + error.message);
     }) */

    this.platform.ready().then(() => {
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
      console.error("About to setup deeplinks in tabs.ts");
      // Convenience to route with a given nav
      this.deeplinks.routeWithNavController(this.navCtrl, {
        '/settings': SettingsPage,
        //'/universal-links-test': BrowsePage,
        '/products/:productId': BrowsePage
      }).subscribe((match: any) => {
        console.log('Successfully routed', JSON.stringify(match));
        
        var result: any = this.parseUri( match.url.$link);
        console.log("Parsed URI looks like: " + JSON.stringify(result.queryParams));
      }, (nomatch) => {
        console.warn('Unmatched Route', JSON.stringify(nomatch));
      });
    })

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

  ionViewDidEnter() {
    //this.tabRef.select(1);
  }

  ionViewDidLoad() {

  }
}
