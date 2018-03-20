import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ENV } from '@app/env';


declare var window: any;
declare var cordova: any;

@Component({
  templateUrl: 'app.html'
})
export class Share {
  rootPage:any = 'TabsPage';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      console.log(`Shareapp is ready.  ProjectId: ${ENV.firebase.projectId}, Mode: ${ENV.mode} Release: ${ENV.release}`);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

     // window.open = (url, target?) =>  this.iab.create(url, "_blank",   { location: 'no', closebuttoncaption: "Done", presentationstyle: 'pagesheet', toolbarposition: 'top', toolbar: 'yes' });
    });
  }
}