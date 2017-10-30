import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';



@Injectable()
export class AlertProvider {

  constructor(public alertCtrl: AlertController) {
    
  }


  public confirm(params: {
    title: string,
    subTitle ?: string,
    message: string,
    buttons ?: { ok: boolean, cancel: boolean },
    
  }): Promise<any> {
    // promise resolves if the user presses OK
    // rejects (with error.cancled = true) if the user presses cancel

    return new Promise((resolve, reject) => {

      let buttons = [];
      if (params.buttons && params.buttons.cancel) {
        buttons.push({
          text: 'Cancel',
          handler: () => {
            let error: any = new Error("User canceled");
            error.canceled = true;
            reject(error);
          }
        })
      }

      if ((params && params.buttons.ok) || !params.buttons || !params.buttons.cancel) {   // need at least one button
        buttons.push({
          text: 'OK',
          handler: () => {
            resolve();
          }
        }
        )
      }

      let confirm = this.alertCtrl.create({
        title: params.title,
        subTitle: params.subTitle || "",
        message: params.message,
        buttons: buttons,
        enableBackdropDismiss: false
      });
      confirm.present();
    })


  }

}
