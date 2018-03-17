import { Component, ErrorHandler } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, Platform } from 'ionic-angular';
import { ENV } from '@app/env';
import { HTTP } from '@ionic-native/http';
import { CallNumber } from '@ionic-native/call-number';
import { Keyboard } from '@ionic-native/keyboard';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ErrorReporterProvider, logTypes, logLevels } from '../../share-common/providers/error-reporter/error-reporter';
import { DataProvider } from '../../share-common/providers/data/data';
import { UserProvider } from '../../share-common/providers/user/user';
import { SocialShareProvider } from '../../share-common/providers/social-share/social-share';
import { AlertProvider } from '../../share-common/providers/alert/alert';
import * as shareTypes from '../../share-common/interfaces/interfaces';
import * as shareConstants from '../../share-common/config/constants';

interface officalsListIf { potus: any[], vPotus: any[], house: any[], senate: any[] };

@IonicPage()
@Component({
  selector: 'page-communicate',
  templateUrl: 'communicate.html',
})
export class CommunicatePage {
  public zipCode: string;
  public notFound: boolean = false;
  public zipAddress: string = '';

  public officialsList: officalsListIf = { potus: [], vPotus: [], house: [], senate: [] }

  public showItems: { showPotus: boolean, showVPotus: boolean, showSenate: boolean, showHouse: boolean }

  public activity: shareTypes.Activity;
  public organization: shareTypes.Organization;

  public submitAttempt: boolean = false;

  public callInProgress: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private http: HTTP, private viewCtrl: ViewController, private err: ErrorReporterProvider,
    private call: CallNumber, private db: DataProvider, private user: UserProvider,
    private socialShare: SocialShareProvider, private alert: AlertProvider, private alertCtrl: AlertController,
    private keyboard: Keyboard, private platform: Platform, private iab: InAppBrowser) {

    console.log('hello CommunicatePage');

    this.activity = navParams.get('activity') || null;
    this.organization = navParams.get('organization') || null;

    this.err.log(`communicate: constructor got activity: ${this.activity} and org: ${this.organization}`);

    // TODO - plumb this through from the activities creation.
    this.showItems = { showPotus: false, showVPotus: false, showSenate: true, showHouse: true };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunicatePage');
  }

  public showHelp() {
    this.alert.confirm({
      title: "Help",
      message: "Click the phone button to be connected to your elected official, or the email button to \
      be transferred to their contact page on the web.  \
      <br> <b>Calling them is the most effective way to let your voice be heard.</b>",
      buttons: { ok: true }
    });
  }

  public registerToVote() {
    const browser = this.iab.create('https://vote.gov', '_blank',
      { location: 'no', closebuttoncaption: "Done", presentationstyle: 'pagesheet', toolbarposition: 'top', toolbar: 'yes' });
    browser.show();
  }
 
  public recordImpact(recipientName: string, action): Promise<any> {
    return new Promise((resolve, reject) => {

      if (!this.user.getEmail()) {
        // no user logged in, just resolve
        resolve();   
      } else {
        const communication: shareTypes.Communicate = {
          activityId: this.activity ? this.activity.metadata.id : null,
          activityHeadline: this.activity ? this.activity.messages.headline : "unidentified activity",
          message: this.activity ? this.activity.messages.mainMessage : "",
          action: action,
          callee: recipientName
        };

        this.db.createDocument('impact', null,
          {
            type: shareConstants.impactTypes.communicate,
            isDemo: false,
            mode: 'inApp',
            donor: {
              id: this.user.getUserId(),
              name: this.user.getDisplayName(),
              email: this.user.getEmail()
            },
            recipient: {
              ein: this.organization.ein || "",
              id: this.organization.metadata.id,
              name: this.organization.companyName,
              email: this.organization.communications.email
            },
            time: new Date(),
            data: communication
          } as shareTypes.Impact)
          .then(() => {
            const alert = this.alertCtrl.create({
              title: 'Thank you!',
              message: `You made a difference by voicing your opinion.<br><br> Want to invite friends to join you?`,
              buttons: [
                {
                  text: 'Share with friends',
                  cssClass: 'share-alert-button',
                  handler: () => {
                    this.socialShare.startSocialShare(this.organization, this.activity,
                      { message: `I'm supporting ${this.organization.companyName} by calling my elected officials, please join me` })
                      .then(() => {
                        resolve();
                      })
                      .catch(error => {
                        this.err.error(`Communication starting SocialShare error: ${error.message}`);
                        reject(error);
                      })
                  }
                },
                {
                  text: 'Not right now',
                  role: 'cancel',
                  handler: () => {
                    this.err.log('communicate: Cancel clicked');
                    resolve();
                  }
                }
              ]
            });
            alert.present();
          })
          .catch(error => {
            this.err.log(`communicate: Error trying to create communicate document: ${error.message}`, logTypes.report, logLevels.normal, { error: ErrorHandler });
            this.alert.confirm({ title: "Error", message: "There was a problem saving your call information. <br><br> This problem has been reported", buttons: { ok: true } });
            reject(error);
          })
      }
    })
  }

  public contactOfficial(which, index) {
    const url = this.officialsList[which][index].data.urls[0];
    const emailName = this.officialsList[which][index].data.name;

    if (!url) {
      this.alert.confirm({
        title: 'Contact page not found',
        message: `${emailName} does not have a contact page`,
        buttons: { ok: true }
      });
    }
    else {
      const browser = this.iab.create(url + '/contact', '_blank',
        { location: 'no', closebuttoncaption: "Done", presentationstyle: 'pagesheet', toolbarposition: 'top', toolbar: 'yes' });
      browser.on('exit').subscribe(() => {
        this.err.log('contactOfficial returning from website, recording impact');
        browser.close();
        this.recordImpact(emailName, 'emailed')
          .then(() => {
            console.log('Communicate: impact recorded');
          }).catch(error => { this.err.error(`communicatePage: calling recordImpact error: ${error.message}`); this.callInProgress = false; });
      })
    }
  }

  public phoneOfficial(which, index) {
    if (this.callInProgress) return;
    this.callInProgress = true;

    const phoneNumber = this.officialsList[which][index].data.phones[0];
    const phoneName = this.officialsList[which][index].data.name;
    this.call.isCallSupported()
      .then(() => {
        this.call.callNumber(phoneNumber, true)
          .then(() => {
            console.log('Launched dialer');
            // delay to debounce the call button this part happens really fast
            setTimeout(() => {
              this.callInProgress = false;
            }, 2000);

            setTimeout(() => {
              this.recordImpact(phoneName, 'called')
                .then(() => {
                  console.log('Communicate: impact recorded');
                }).catch(error => { this.err.error(`communicatePage: calling recordImpact error: ${error.message}`); this.callInProgress = false; });
            }, 6000)
          }).catch(() => {
            this.err.error('Error launching dialer');
            this.callInProgress = false;
          })
      }).catch(() => {
        this.callInProgress = false;
        this.alert.confirm({
          title: 'Not available',
          message: 'Sorry, you can\'t call from this device.',
          buttons: { ok: true }
        });
      });
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

  public toggleItem(which, index) {
    this.officialsList[which][index].selected = !this.officialsList[which][index].selected;
  }

  public somethingSelected() {
    return (false);
  }

  private parseOfficials(officeList) {
    const senate = "United States Senate";
    const house = "United States House of Representatives";

    let updSenateList: any[] = [];
    let updHouseList: any[] = [];

    const addr = officeList.normalizedInput;
    this.zipAddress = `${addr.city}, ${addr.state}, ${addr.zip}`;

    for (const office of officeList.offices) {
      if (this.showItems.showSenate && office.name === senate) {
        // collect the senators
        for (const senateIndex of office.officialIndices) {
          updSenateList.push({ selected: true, data: officeList.officials[senateIndex] });
        }
        this.officialsList.senate = updSenateList;
      }
      // partial match because the division name is appended in the response.
      if (this.showItems.showHouse && office.name.indexOf(house) > -1) {
        for (const houseIndex of office.officialIndices) {
          updHouseList.push({ selected: true, data: officeList.officials[houseIndex] });
        }
        this.officialsList.house = updHouseList;
      }
    }

  }

  private performQuery(zip) {
    const url = 'https://www.googleapis.com/civicinfo/v2/representatives';

    const params =
      {
        key: ENV.firebase.apiKey,
        includeOffices: 'true',
        address: zip,
        levels: 'country'
      };
    const headers =
      {
        'Content-Type': 'application/json'
      };

    this.err.log(`CommunicatePage: About to call CivicAPI`);
    this.http.get(url, params, headers)
      .then(data => {
        if (this.platform.is('cordova')) {
          this.keyboard.close();
        }

        const jData = JSON.parse(data.data);
        this.parseOfficials(jData);
      }).catch(error => {
        this.err.log('Civic query failed finding zip ' + this.zipCode);
        this.zipAddress = 'Nothing found.  Please try again.'
      });
  }

  public updateSearch(evt) {

    function charIsNumeric(c) { return !isNaN(parseInt(c, 10)); }

    if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(this.zipCode)) {
      // look up the representatives by zip
      this.err.log(`Got a valid zip: ${this.zipCode}`);
      this.performQuery(this.zipCode);
    } else {
      const curLen = this.zipCode.length;
      const curPos = curLen - 1
      if (curLen == 6 && charIsNumeric(this.zipCode[curPos])) {
        // insert the hyphen for zip+4
        this.zipCode = this.zipCode.substring(0, curPos) + '-' + this.zipCode[curPos];
        return;
      }
      // Only numbers except for a hyphen at position 6 allowed.
      if (!charIsNumeric(this.zipCode[curPos])) {
        this.zipCode = this.zipCode.substring(0, curPos);
      }

      // Only show officials when we have a valid zip.
      this.officialsList.house = this.officialsList.senate = this.officialsList.potus = this.officialsList.vPotus = [];
      this.zipAddress = '';
    }
  }

}
