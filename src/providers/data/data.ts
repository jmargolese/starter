import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  public organizations: Observable<any[]>;
  private organizationsCollection: AngularFirestoreCollection<any>;

  constructor(public db: AngularFirestore, public readonly afs: AngularFirestore) {
    console.log('Hello DataProvider Provider');

    this.organizationsCollection = afs.collection<any>('organizations');


  }

  public getActivitiesForOrg(collection, orgId) : Observable<any> {
    // TODO need to abstract this so higher levels can send us queries

   let itemCollection: AngularFirestoreCollection<any> = this.afs.collection(collection, 
      ref => ref.where('organization', '==', orgId).where('info.enabled', '==', true));

    return itemCollection.snapshotChanges()
     // returns observable of DocumentChangeAction[]
     .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as {};
        const id = a.payload.doc.id;
        //console.log("Here's the data: " + JSON.stringify(data));
        //console.log("Here's the id: " + JSON.stringify(id));
        return { id, ...data };
      });
    });

  }

  
  public getCollection(collectionName): AngularFirestoreCollection<any> {

    let newCollection: AngularFirestoreCollection<any> = this.afs.collection<any>(collectionName);

    return newCollection;
  }

  public getDocument(collectionName, key) : Observable<any> {

    var docRef : AngularFirestoreDocument<any> = this.db.collection(collectionName).doc(key);

    return docRef.valueChanges();
  }

  public getSnapshot(collection: AngularFirestoreCollection<any>): Observable<any[]> {
    // returns observable of DocumentChangeAction[]
    return collection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as {};
        const id = a.payload.doc.id;
        //console.log("Here's the data: " + JSON.stringify(data));
        console.log("Here's the id: " + JSON.stringify(id));
        return { id, ...data };
      });
    });


  }

  public updateDocument(collectionName: string, documentKey: string, data: {}): void {

    let collection: AngularFirestoreCollection<any> = this.afs.collection<any>(collectionName);

    collection.doc(documentKey).update(data).then(() => {
      console.log("Wrote document for:" + documentKey);
    }
    )
      .catch(error => {
        console.error("Error writing document for " + documentKey + " error: " + error.message);
      })
  }

}
