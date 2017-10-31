import { NavController } from 'ionic-angular';
import { Component, Input } from '@angular/core';


/**
 * Generated class for the HomeListOrganizationComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'home-list-organization',
  templateUrl: 'home-list-organization.html'
})
export class HomeListOrganizationComponent {

  @Input('organization') organization

  public  buttonsToDisplay = {
    first : "addToHome",
    second: "donate",
    third: "socialShare"
  }

  constructor( public navCtrl : NavController) {

  }

  

  public goToOrg(organization) {
    this.navCtrl.push('OrgHomePage', { organization: organization, showHeader : true})
  }

}
