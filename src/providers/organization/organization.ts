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

   this.organizationsCollection = db.getCollection('organizations');  // TODO abstract this so we don't know about 'collections'?
   

   this.allOrganizations = db.getSnapshot(this.organizationsCollection);
  }


  public getAllOrganizations() : Observable<any[]> {
    return this.allOrganizations;
  }



}
