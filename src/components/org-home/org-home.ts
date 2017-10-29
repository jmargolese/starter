import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivitiesProvider } from './../../providers/activities/activities';

/**
 * Generated class for the OrgHomeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'org-home',
  templateUrl: 'org-home.html'
})
export class OrgHomeComponent {

  @Input('organization') organization


  public activities: Observable<any> = null;
  public topBackgroundColor = "#FFFFFF";

  constructor(public activitiesProvider: ActivitiesProvider) {
  
    

  }

  // there is no ionic lifecycle events in components
  ngAfterViewInit() {
    /* setTimeout(function() {
      this.topBackgroundColor = this.organization.info.backgroundColor || "#FFFFFF";
    }, 1); */
   
    this.activities = this.activitiesProvider.getActivitiesForOrg(this.organization.id);
  }

}
