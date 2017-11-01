import { Component, Input } from '@angular/core';

/**
 * Generated class for the ActionsBarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'actions-bar',
  templateUrl: 'actions-bar.html'
})
export class ActionsBarComponent {

  @Input('buttonsToDisplay') buttonsToDisplay;
  @Input('organization') organization;
  @Input('activity') activity;

  constructor() {
    
  }

}
