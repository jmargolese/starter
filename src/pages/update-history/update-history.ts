import { UserProvider } from './../../share-common/providers/user/user';
import { DataProvider } from './../../share-common/providers/data/data';
import { Subscription } from 'rxjs/Subscription';
import { ErrorReporterProvider, logTypes, logLevels } from './../../share-common/providers/error-reporter/error-reporter';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding } from 'ionic-angular';

import * as shareTypes from '../../share-common/interfaces/interfaces';
import { AlertProvider } from '../../share-common/providers/alert/alert';

@IonicPage()
@Component({
  selector: 'page-update-history',
  templateUrl: 'update-history.html',
})
export class UpdateHistoryPage {

  public updateList: shareTypes.UpdateMessages[];
  public orgId: string = "";
  public organization: shareTypes.Organization = null;
  public updateListSubscription: Subscription = null;
  public isOrgOwner: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alert: AlertProvider,
    private err: ErrorReporterProvider, private db: DataProvider, private userProvider: UserProvider) {

    this.organization = this.navParams.get('organization');
    this.orgId = this.organization.metadata.id;

    this.isOrgOwner = this.orgId && (this.userProvider.getOrganizationId() == this.orgId);
  }

  ionViewWillEnter() {
    if (!this.orgId) {
      this.err.log(`UpdateHistoryPage: Called with no OrganizationID.`, logTypes.report, logLevels.normal);
      this.alert.confirm({ title: "Error", message: "We can't display the update history right now.  Please try again" })
        .then(() => {
          this.navCtrl.pop();
        })
    } else {
      this.updateListSubscription = this.db.getUpdateHistory(this.orgId)
        .subscribe(updateList => {
          this.updateList = updateList;
        }, error => {
          this.err.log(`UpdateHistory: Error getting updateList Subscription: ${error.message}`, logTypes.report, logLevels.normal, { error: error, orgId: this.orgId });

        })
    }
  }



  ionViewDidLeave() {

    if (this.updateListSubscription) {
      try {
        this.updateListSubscription.unsubscribe();
      } catch (error) {
        this.err.error(`updateHistory unloading error calling updateListSUbscription.unsubscribe: ${error.message}`);
      }
    }
  }

  public deleteUpdate(update: shareTypes.UpdateMessages, slidingItem: ItemSliding) {
    this.alert.confirm({
      title: 'Confirm', message: `Are you sure you want to delete the update: ${update.update.updateText.substr(0, 250)}`,
      buttons: { ok: true, cancel: true }
    })
      .then(() => {
        this.err.log(`UpdateHistory: About to delete update: ${update.metadata.id}`);
        let clearUpdateFromOrg: boolean = false;
        try {
          clearUpdateFromOrg = this.organization.update && this.organization.update.time && this.organization.update.updateText && this.organization.update.time.valueOf() == update.update.time.valueOf() && this.organization.update.updateText == update.update.updateText;
        } catch (error) {
          this.err.log(`In update-history:delete Update error setting up ClearUpdateFromOrg: ${error.message}`, logTypes.report, logLevels.normal, { error: error, orgUpdate: this.organization.update || null, update: update });
        }


        this.db.deleteDocument('updateMessages', update.metadata.id)
          .then(() => {
            if (clearUpdateFromOrg) {
              const updateData = {
                update:
                  {
                    updateText: ""
                  }
              }
              this.err.log(`Update History, deleted message about to clear update from ORganization after deleting updateMessage: ${this.orgId}  update: ${JSON.stringify(updateData)}`);
              this.db.updateDocument('organizations', this.orgId, updateData)
                .then(updatedOrg => {
                  this.err.log(`updateHistory: successfully deleted document and updatedOrg (update was current)`);
                  // this.alert.confirm({ title: 'Success', message: 'The update was deleted' });
                })
                .catch(error => {
                  this.err.log(`UpdateHistory: Error clearing latest update from Organization: ${error.message} (org: ${this.orgId})`,
                    logTypes.report, logLevels.normal, { error: error, organization: this.organization });
                  this.alert.confirm({ title: "Problem", message: "The update was deleted from the history, but we could not delete it from the home page.  <br> You can go to that page and press 'add update' and clear it from there." });
                })
            } else {
              this.err.log(`updateHistory: successfully deleted document`);
              // this.alert.confirm({ title: 'Success', message: 'The update was deleted' });
            }


          })
          .catch(error => {
            this.err.log(`UpdateHistory: Error deleting document with key: ${update.metadata.id} : ${error.message}`,
              logTypes.report, logLevels.normal, { error: error, document: update })
            this.alert.confirm({ title: 'Error', message: 'Something went wrong, the update was not removed' });
          })
      })
      .catch(error => {
        // nothing to do, the user canceled the delete
        slidingItem.close();
      })


  }



}
