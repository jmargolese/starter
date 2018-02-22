import { SocialShareProvider } from './../../share-common/providers/social-share/social-share';
import { AlertProvider } from './../../share-common/providers/alert/alert';
import { UserProvider } from './../../share-common/providers/user/user';
import { DataProvider } from './../../share-common/providers/data/data';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { ErrorReporterProvider, logTypes, logLevels } from './../../share-common/providers/error-reporter/error-reporter';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as shareTypes from '../../share-common/interfaces/interfaces';
import * as constants from '../../share-common/config/constants';

@IonicPage()
@Component({
  selector: 'page-volunteer',
  templateUrl: 'volunteer.html',
})
export class VolunteerPage {

  public activity: shareTypes.Activity;
  public organization: shareTypes.Organization;
  public volunteerMessage: string = "";
  public volunteer: { before: boolean, during: boolean, after: boolean } = { before: false, during: false, after: false };
  public curForm: FormGroup;
  public submitAttempt: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams, private user: UserProvider, private alertCtrl: AlertController,
    private err: ErrorReporterProvider, public viewCtrl: ViewController, private data: DataProvider, private alert: AlertProvider,
    private socialShare: SocialShareProvider, public formBuilder: FormBuilder) {

    this.activity = navParams.get('activity') || null;
    this.organization = navParams.get('organization') || null;

    this.err.log(`volunteer: constructor got activity: ${this.activity} and org: ${this.organization}`);

    this.curForm = formBuilder.group({
      message: ['', Validators.compose([Validators.maxLength(350), Validators.required])]
    });
  }

  ionViewDidLoad() {
    this.err.log('ionViewDidLoad VolunteerPage');
  }

  public submit() {

    if (!this.curForm.valid) {
      this.submitAttempt = false;
      this.err.error(`volunteer: Submit pressed when the form is invalid`);
      this.alert.confirm({ title: 'Error', message: "Please correct errors and try again", buttons: { ok: true } });   // this should not happen
    }
    else {
      this.submitAttempt = true;
      this.data.createDocument('impact', null,
        {
          type: constants.impactTypes.volunteer,
          isDemo: false,
          donor: { id :this.user.getUserId(),
            name: this.user.getDisplayName(),
            email: this.user.getEmail()
          },
          recipient:   {
            ein:  this.organization.ein || "",
            id: this.organization.metadata.id,
            name: this.organization.companyName,
            email: this.organization.communications.email
        },
          time : new Date(),
          data: {
            activityId: this.activity ? this.activity.metadata.id : null,
            activityHeadline: this.activity ? this.activity.messages.headline : "unidentified activity",
            organizationId: this.organization ? this.organization.metadata.id : null,
            when: this.volunteer,
            message: this.curForm.controls.message.value,
            date : null
          } 
        } as shareTypes.Impact)
        .then(() => {
          let alert = this.alertCtrl.create({
            title: 'Thank you!',
            message: `${this.organization.companyName} will be notified immediately of your generous offer. <br><br> Want to invite friends to join you?`,
            buttons: [
              {
                text: 'Share with friends',
                cssClass: 'share-alert-button',
                handler: () => {
                  this.socialShare.startSocialShare(this.organization, this.activity,
                    { message: `I'm volunteering to help ${this.organization.companyName}, please join me` })
                    .then(() => {
                      this.viewCtrl.dismiss({ error: false, canceled: false });
                      this.submitAttempt = true;
                    })
                    .catch(error => {
                      this.err.error(`Volunteer starting SocialShare error: ${error.message}`);
                      this.viewCtrl.dismiss({ error: error, canceled: false });
                      this.submitAttempt = true;
                    })
                }
              },
              {
                text: 'Not right now',
                role: 'cancel',
                handler: () => {
                  this.err.log('volunteer: Cancel clicked');
                  this.viewCtrl.dismiss({ error: false, canceled: true });
                }
              }
            ]
          });
          alert.present();
        })
        .catch(error => {
          this.err.log(`volunteer: Error trying to create volunteer document: ${error.message}`, logTypes.report, logLevels.normal, { error });
          this.alert.confirm({ title: "Error", message: "There was a problem submitting your offer to volunteer. <br><br> Please try again, this problem has been reported", buttons: { ok: true } });
          this.submitAttempt = false;
        })
    }

  }

  public cancel() {
    let data = { canceled: true };
    this.viewCtrl.dismiss(data)
      .catch(() => { });
  }

}