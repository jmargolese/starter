import { NavController } from 'ionic-angular';
import { OrgHomePage } from './../../pages/org-home/org-home';
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
    console.log('Hello HomeListOrganizationComponent Component');
  }

  

  public goToOrg(organization) {
    this.navCtrl.push('OrgHomePage', { organization: organization})
  }

}
