import { DashboardPage } from './../dashboard/dashboard';
import { SettingsPage } from './../settings/settings';
import { AuthProvider } from './../../providers/auth/auth';
import { Component , ViewChild} from '@angular/core';


import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { BrowsePage } from '../browse/browse';

import {Tabs, Events} from 'ionic-angular'

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

  constructor(private authProvider: AuthProvider, public events: Events) {
    events.subscribe('tabs:select', (newTab) => {
      // let other parts of the app tell us when a new tab is needed
      this.tabRef.select(newTab);
    });

    authProvider.getUser();       // just trigger it to init
  }

  ionViewDidEnter() {
    //this.tabRef.select(1);
  }
}
