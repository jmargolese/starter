import { Subscription } from 'rxjs/Subscription';
import { DataProvider } from './../../share-common/providers/data/data';
import { ErrorReporterProvider } from './../../share-common/providers/error-reporter/error-reporter';
import { Component } from '@angular/core';
import { IonicPage, ViewController, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import * as shareTypes from '../../share-common/interfaces/interfaces';



@IonicPage()
@Component({
  selector: 'page-petition',
  templateUrl: 'petition.html',
})
export class PetitionPage {

  public petitions: shareTypes.Petition[] = [];
  public petitionSubscription: Subscription = null;

  constructor(private viewCtrl: ViewController, private iab: InAppBrowser, private platform: Platform, private err: ErrorReporterProvider,
    private db: DataProvider) {
  }

  ionViewDidLoad() {

    this.unsubscribe();
    this.petitionSubscription = this.db.getSnapshot(this.db.getCollection('petitions'))
      .subscribe(petitions => {
        this.petitions = petitions;
      })


  }

  private unsubscribe() {
    try {
      if (this.petitionSubscription) {
        this.petitionSubscription.unsubscribe();
      }
    } catch (error) {

    }
  }
  ionViewWillUnload() {
    this.unsubscribe();
  }

  public dismiss() {
    let data = { canceled: true, action: 'petitioned' };
    this.viewCtrl.dismiss(data)
      .catch(() => { });
  }

  public openPetition(petition: shareTypes.Petition): void {
    this.err.log(`PetitionPage: About to open petition: ${petition.title}`);

    const browser = this.iab.create(petition.url, '_blank',
      { location: 'no', closebuttoncaption: "Done", presentationstyle: 'pagesheet', toolbarposition: 'top', toolbar: 'yes' });

    if (this.platform.is('cordova')) {

      // browser iab doesn't support subscribe
      browser.on('exit').subscribe(() => {

        this.viewCtrl.dismiss({ error: null, canceled: false , data: { action: 'petitioned', target: petition.title}});
        /* this.data.createDocument('impact', null,
          this.createDonateRecord() as shareTypes.Impact)
          .then(() => {
            this.analytics.logEvent('volunteer', { website: true });
            this.alert.confirm({ title: "Thank you!", message: "Thank you for volunteering", buttons: { ok: true, cancel: false } })
              .then(() => { this.viewCtrl.dismiss({ error: false, canceled: true }); })
          })
          .catch(error => {
            this.err.error(`Volunteer: Error creating donateRecord: ${error.message}`);
          }) */


      })
    }
  }

}
