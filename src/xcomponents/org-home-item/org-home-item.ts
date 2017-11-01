import { Component, Input } from '@angular/core';

/**
 * Generated class for the OrgHomeItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'org-home-item',
  templateUrl: 'org-home-item.html'
})
export class OrgHomeItemComponent {

  @Input('organization') organization
  @Input('activity') activity
  
  public  buttonsToDisplay = {
    first : "donate",
    second: "like",
    third: "socialShare"
  }

  constructor() {
   
    
  }


 

}
