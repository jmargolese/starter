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

  constructor(public userProvider : UserProvider, public socialSharing: SocialSharing) {
    console.log('Hello ActionButtonComponent Component');
    
  }

  // supporting actions for each button
  public toggleAddToHome(id) {
    console.log("toggleAddToHome called with id: " + id);
    this.userProvider.toggleAddToHome(id);
  }

  
  public toggleFavoriteActivity(id) {
    console.log("toggleFavoriteActivity called with id: " + id);
    this.userProvider.toggleFavoriteActivity(id);
  }

  public startSocialShare() {
    // give priority to activities, but fall back as gracefully as we can
      const options = {
        message: (this.activity && this.activity.social.message) || (this.organization && this.organization.social.message) || "I support " + this.organization.companyName,
        subject:  (this.activity && this.activity.social.subject) || (this.organization && this.organization.social.subject) || this.organization.companyName,
        url:  (this.activity && this.activity.social.url) || (this.organization && this.organization.social.url) || "http://getshare.mobi",
        files : [(this.activity && this.activity.images.image) || (this.organization && this.organization.images.image) || ""]
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
