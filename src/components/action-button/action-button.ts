import { AlertProvider } from './../../providers/alert/alert';
import { ShareProvider } from './../../providers/share/share';
import { ToastController, Events } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { UserProvider } from './../../providers/user/user';
import { Component, Input } from '@angular/core';

import { SocialSharing } from '@ionic-native/social-sharing';


/**
 * Generated class for the ActionButtonComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'action-button',
  templateUrl: 'action-button.html'
})
export class ActionButtonComponent {

  @Input('buttonToDisplay') buttonToDisplay
  @Input('organization') organization
  @Input('activity') activity

  public addToHomeText: string;

  constructor(public userProvider: UserProvider, public socialSharing: SocialSharing, public alert: AlertProvider,
    public auth: AuthProvider, public toastCtrl: ToastController, public share: ShareProvider, public events: Events) {

  }

  ngAfterContentInit() {
    this.setButtonText();
  }

  public setButtonText() {
    switch (this.buttonToDisplay) {
      case "addToHome":
        this.addToHomeText = this.userProvider.userLikesOrganization(this.organization.id) ? "Remove from home" : "Add to home";
        break;

      default:
        break;
    }
  }

  public presentToast(message: string): void {
    let toast: any = this.toastCtrl.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }

  // supporting actions for each button
  public toggleAddToHome(id) {
    console.log("toggleAddToHome called with id: " + id);




    let onlyTurnOn: boolean = false;

    this.userProvider.isAuthenticated()
      .then(isAuthenticated => {
        onlyTurnOn = !isAuthenticated;    // if we are not authenticated, we only allow turning ON the follow to avoid turning off when the user logs-in
      })


    this.auth.getAuthenticatedUser("You need to login to do that")
      .then(() => {
       
        this.userProvider.toggleAddToHome(id, onlyTurnOn)
          .then(() => {
            console.log("ActionButton:Toggle addToHome suceeded");
            this.setButtonText();
            if (this.userProvider.userLikesOrganization(this.organization.id))
              this.events.publish('tabs:select', 0);      // switch to the Home Tab
          })
      }).catch(error => {
        if (error.canceled) {
          console.log("User canceled in ActionButton:ToggleAddToHome");
        } else {
          console.error("Error in action-button:toggleAddToHome: " + error.message);
          this.alert.confirm({ title: "Error", message: "Sorry, something went wrong, please try again later.", buttons: { ok: true, cancel: false } })

        }
      })
  }


  public toggleFavoriteActivity(id) {
    console.log("toggleFavoriteActivity called with id: " + id);
    this.auth.getAuthenticatedUser("You need to login to do that")
      .then(() => {
        this.userProvider.toggleFavoriteActivity(id)
          .then(() => {
            console.log("Toggle favorite activity suceeded");
          })
      }).catch(error => {
        if (error.canceled) {
          console.log("User canceled in toggleFavoriteActivity");
        } else {
          console.error("Error in action-button:toggleFavoriteActivity: " + error.message);
          this.alert.confirm({ title: "Error", message: "Sorry, something went wrong, please try again later.", buttons: { ok: true, cancel: false } })
        }
      })

  }

  public donate(id) {
    console.log("donate called with id: " + id);
    this.auth.getAuthenticatedUser("You need to login to do that")
      .then(() => {
        this.share.donate(this.activity, this.organization)
          .then(() => {
            console.log("action-button:donate:share activity suceeded");
          })
          .catch(error => {
            console.error("Error in action-button:donate: " + error.message);
            this.alert.confirm({ title: "Error", message: "Sorry, something went wrong, please try again later.", buttons: { ok: true, cancel: false } })

          })
      }).catch(error => {
        if (error.canceled) {
          console.log("User canceled in action-button:donate");
        } else {
          console.error("Error in action-button:donate: " + error.message);
          this.presentToast("Sorry, something went wrong, please try again later.");
        }
      })

  }

  public startSocialShare() {
    // give priority to activities, but fall back as gracefully as we can
    const options = {
      message: (this.activity && this.activity.social.message) || (this.organization && this.organization.social.message) || "I support " + this.organization.companyName,
      subject: (this.activity && this.activity.social.subject) || (this.organization && this.organization.social.subject) || this.organization.companyName,
      url: (this.activity && this.activity.social.url) || (this.organization && this.organization.social.url) || "http://getshare.mobi",
      files: [(this.activity && this.activity.images.image) || (this.organization && this.organization.images.image) || ""]
    }


    this.socialSharing.shareWithOptions(options)
      .then(() => {
        console.log("Social share succeeded!");
      })
      .catch(error => {
        console.error("Error in socialSharing: " + error.message);
      })
  }
}
