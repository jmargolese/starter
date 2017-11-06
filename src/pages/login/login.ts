import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { UserProfile, UserContactPrefs } from './../../share-common/interfaces/interfaces.d';
import { AlertProvider } from './../../share-common/providers/alert/alert';
import { UserProvider } from './../../share-common/providers/user/user';
import { AuthProvider } from './../../share-common/providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import * as shareTypes from '../../share-common/interfaces/interfaces';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild(Slides) loginSlides: Slides;

  public title: string = "Sign-in";
  public loginForm: FormGroup;
  public createForm: FormGroup;

  public errorMessage: string = "";




  // seemds to be a bug where checkbox can't read an object
  public emailForLikes: true;
  public emailForGeneral: true;

  public explainMessage: string = "";

  public submitAttempt: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
    public auth: AuthProvider, public toastCtrl: ToastController, public viewCtrl: ViewController, public analytics: AnalyticsProvider,
    public alert: AlertProvider, public alertCtrl: AlertController, public userProvider: UserProvider) {


    this.explainMessage = navParams.get('message');

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      passcode: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
    });

    this.createForm = formBuilder.group({
      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      email: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      passcode: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.loginSlides.lockSwipes(true);
    //this.slides.slideTo(0,0);
  }

  ionViewDidEnter() {
    this.analytics.setCurrentScreen('BrowsePage');
  }

  public clearExplainMessage() {
    this.explainMessage = "";
  }

  public presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  public cancel() {
    // add the empty catch to deal with an Ionic bug throughing and exception https://github.com/ionic-team/ionic/issues/11776#issuecomment-314050068
    let data = { canceled: true };
    this.viewCtrl.dismiss(data)
      .catch(() => { });
  }

  public showCreateNewAccount() {
    this.clearExplainMessage();
    this.loginSlides.lockSwipes(false);
    this.loginSlides.slideTo(1);
    this.loginSlides.lockSwipes(true);
  }

  public showSignIn() {
    this.clearExplainMessage();
    this.loginSlides.lockSwipes(false);
    this.loginSlides.slideTo(0);
    this.loginSlides.lockSwipes(true);
  }
  public forgotPasscode() {
    this.clearExplainMessage();

    let confirm = this.alertCtrl.create({
      title: 'Reset passcode?',
      message: "Please enter your email address for this account",
      inputs: [
        {
          name: 'email',
          placeholder: 'email'
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Submit',
          handler: (data) => {
            if (!data.email || data.email == "") {
              this.submitAttempt = true;
              this.errorMessage = "You must enter a valid email address";
            }
            else
              this.auth.resetPasscode(data.email)
                .then(() => {
                  this.presentToast("Reset message sent.  Please check your email and follow the instructions.");
                  this.submitAttempt = false;
                })
                .catch(error => {
                  this.submitAttempt = true;
                  if (error.code == 'auth/user-not-found')
                    this.errorMessage = "We couldn't find that email address, please try again.";
                  else
                    this.errorMessage = "Sorry, something went wrong, please try again later";
                  console.error("Reset passcode failed in settings-passcode: " + error.message);

                })
          }
        }
      ]
    });
    confirm.present();
  }
  public submit() {
    this.clearExplainMessage();
    this.submitAttempt = true;

    if (this.loginForm.valid) {

      console.log("about to login");
      this.userProvider.login(this.loginForm.value.email, this.loginForm.value.passcode)
        .then(user => {
          console.log("Login successful");
          this.submitAttempt = false;
          this.presentToast("Login successful");
          this.viewCtrl.dismiss({ loggedIn: true, error: false, canceled: false });

        })
        .catch(error => {
          console.error("Error logging in: " + error.message);
          this.errorMessage = "Login failed, please try again";
        })

    } else {
      this.errorMessage = "Please correct errors and try again";
    }
  }

  public createAccount() {
    this.clearExplainMessage();
    this.submitAttempt = true;

    if (!this.createForm.valid) {
      console.error("create account form is not valid");
      this.errorMessage = "Please correct errors and try again";
    } else {

      let profile: shareTypes.UserProfile = {
        name: {
          first: this.createForm.value.firstName,
          last: this.createForm.value.lastName,
        },
        email: this.createForm.value.email,
        phoneNumber: ""
      };

      let contactPrefs: shareTypes.UserContactPrefs = {
        emailForGeneral: this.emailForGeneral ? true : false,
        emailForLikes: this.emailForLikes ? true : false
      };
      this.userProvider.createAccount(this.createForm.value.email, this.createForm.value.passcode, profile, contactPrefs)
        .then((user) => {
          console.log('created user account ');

          this.viewCtrl.dismiss({ loggedIn: true, error: false, canceled: false });
          this.presentToast("Your account has been created!");
          this.submitAttempt = false;
        })
        .catch(error => {
          let errorCode = error.code;
          // let errorMessage = error.message;
          let displayErrorMessage: string = "";

          if (errorCode == 'auth/weak-password') {
            displayErrorMessage = "Please try again with a stronger passcode (at least six characters)";
          }
          else if (errorCode == 'auth/email-already-in-use') {
            displayErrorMessage = "That email is already in use. Please login or reset your passcode";
          } else {
            console.error("Error creating an account:  " + error.message + "/: " + error.code);
            displayErrorMessage = "Sorry, something went wrong, please try again";
          }

          if (displayErrorMessage)
            this.alert.confirm({ title: "Error", message: displayErrorMessage, buttons: { ok: true, cancel: false } });

          this.submitAttempt = false;

        });
       
  }
}
  public loginFacebook() {
  this.clearExplainMessage();
  console.log("Going to login with facebook!");
  this.auth.loginFacebook()
    .then(user => {
      console.log("logged into facebook");
    })
    .catch(error => {
      console.error("Error logging in to facebook");
      this.errorMessage = "Something went wrong, please try again";
    })
}

}
