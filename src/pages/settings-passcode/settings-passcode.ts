import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the SettingsPasscodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings-passcode',
  templateUrl: 'settings-passcode.html',
})
export class SettingsPasscodePage {

  public title: string = "Change passcode";
  public profileForm: FormGroup;

  public errorMessage: string = "Please correct errors and resubmit";

  public submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public auth: AuthProvider, public toastCtrl: ToastController, public alertCtrl: AlertController) {

    this.profileForm = formBuilder.group({
      currentPasscode: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      passcode: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(6), Validators.required])],
      confirmPasscode: ['', Validators.compose([Validators.maxLength(30), Validators.required])]

    }, { validator: this.matchingPasswords('passcode', 'confirmPasscode') });
  }

  private matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  public update() {

    this.submitAttempt = true;

    if (!this.profileForm.valid) {
      this.errorMessage = "Please correct errors and resubmit";
      console.error("form is not valid");
    } else {
      this.auth.updatePasscode(this.profileForm.controls.currentPasscode.value, this.profileForm.controls.passcode.value)
        .then(() => {
          console.log("Passcode updated!");
          this.submitAttempt = false;
        })
        .catch(error => {
          console.error("Error updating passcode: " + error.message);
          this.errorMessage = "Error updating passcode: " + error.message;
        })

    }

  }

  public forgotPasscode() {
    let confirm = this.alertCtrl.create({
      title: 'Reset passcode?',
      message: "Do you want to reset your passcode? (We'll send you an email)",
      buttons: [
        {
          text: 'No'
        },
        {
          text: 'Yes',
          handler: () => {
            this.auth.resetPasscode()
              .then(() => {
                this.presentToast("Reset message sent to your email");
              })
              .catch(error => {
                console.error("Reset passcode failed in settings-passcode: " + error.message);
                this.presentToast("Sorry, something went wrong, please try again later");
              })
          }
        }
      ]
    });
    confirm.present();
  }

  public presentToast(message: string): void {
    let toast: any = this.toastCtrl.create({
      message: message,
      duration: 3000,
    });
    toast.present();
  }



}
