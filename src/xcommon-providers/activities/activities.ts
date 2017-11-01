import { Observable } from 'rxjs/Observable';
import { DataProvider } from './../data/data';
import { Injectable } from '@angular/core';


/*
  Generated class for the ActivitiesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ActivitiesProvider {

  constructor(public db: DataProvider) {
  }

  public getActivitiesForOrg(orgId) : Observable<any> {

    return this.db.getActivitiesForOrg('activities', orgId);
  }
}
