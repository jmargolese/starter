import { UserProvider } from './../user/user';
import { DataProvider } from './../data/data';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';



/*
  Generated class for the OrganizationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrganizationProvider {

  private organizationsCollection: AngularFirestoreCollection<any>;
  public allOrganizations: Observable<any[]>;

  constructor(private db: DataProvider, public userProvider: UserProvider) {
    console.log('Hello OrganizationProvider Provider');

  }


  public getAllOrganizations() : Observable<any[]> {
    this.allOrganizations = this.db.getAllOrganizations(true);
    return this.allOrganizations;
  }



}
