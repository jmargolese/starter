import { AuthProvider } from './../../providers/auth/auth';
import { Component , ViewChild} from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { BrowsePage } from '../browse/browse';

import {Tabs} from 'ionic-angular'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  @ViewChild('shareTabs') tabRef: Tabs;

  tab1Root = HomePage;
  tab2Root = BrowsePage;
  tab3Root = AboutPage;
  tab4Root = ContactPage;

  constructor(private authProvider: AuthProvider) {
    authProvider.getUser();       // just trigger it to init
  }

  ionViewDidEnter() {
    //this.tabRef.select(1);
  }
}
