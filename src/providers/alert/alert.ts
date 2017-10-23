import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';



@Injectable()
export class AlertProvider {

  constructor(public alertCtrl: AlertController) {
    console.log('Hello AlertProvider Provider');
  }


  public confirm(params: {
    title: string,
    message: string
  }): Promise<any> {
    // promise resolves if the user presses OK
    // rejects (with error.cancled = true) if the user presses cancel

    return new Promise((resolve, reject) => {

      let confirm = this.alertCtrl.create({
        title: params.title,
        message: params.message,
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              let error: any = new Error("User canceled");
              error.canceled = true;
              reject(error);
            }
          },
          {
            text: 'OK',
            handler: () => {
              resolve();
            }
          }
        ]
      });
      confirm.present();
    })


  }

}
