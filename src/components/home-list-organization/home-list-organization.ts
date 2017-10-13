import { NavController } from 'ionic-angular';
import { OrgHomePage } from './../../pages/org-home/org-home';
import { UserProvider } from './../../providers/user/user';
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


  constructor(public userProvider : UserProvider, public navCtrl : NavController) {
    console.log('Hello HomeListOrganizationComponent Component');
  }

  public toggleAddToHome(id) {
    console.log("toggleAddToHome called with id: " + id);
    this.userProvider.toggleAddToHome(id);
  }

  public goToOrg(organization) {
    this.navCtrl.push(OrgHomePage, { organization: organization})
  }

}
