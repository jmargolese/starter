import { UserProvider } from './../../providers/user/user';
import { Component, Input } from '@angular/core';


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

  constructor(public userProvider : UserProvider) {
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

}
