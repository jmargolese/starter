import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public auth: AuthProvider, public toastCtrl: ToastController, public viewCtrl: ViewController, public alertCtrl: AlertController, public userProvider: UserProvider) {


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

  public clearExplainMessage() {
    this.explainMessage = "";
  }

  public presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'middle'
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
      this.auth.login(this.loginForm.value.email, this.loginForm.value.passcode)
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


      this.auth.createAccount(this.createForm.value.email, this.createForm.value.passcode)
        .then((user) => {
          console.log('created user account ');

          this.userProvider.createNewUser({
            email: this.createForm.value.email,
            firstName: this.createForm.value.firstName,
            lastName: this.createForm.value.lastName,
            contactPrefs: { 
              emailForLikes: this.emailForLikes ? true : false,
              emailForGeneral: this.emailForGeneral ? true : false}
          })
            .then(() => {
              this.viewCtrl.dismiss({ loggedIn: true, error: false, canceled: false });
              this.presentToast("Your account has been created!");
              this.submitAttempt = false;
            })
            .catch(error => {
              console.error("Error trying save user info after creating new account in login: " + error.message);
              this.errorMessage = "";
              // the account was created, so login works, we'll need a way to recover the user info later when this happens
              // should create the user record from the auth trigger and then we can update it at our leisure
            })


        })
        .catch(error => {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == 'auth/weak-password') {
            this.errorMessage = "Please try again with a stronger passcode (at least six characters)";
          }
          else if (errorCode == 'auth/email-already-in-use') {
            this.errorMessage = "That email is already in use. Please login or reset your passcode";
          } else {
            console.error("Error creating an account:  " + error.message + "/: " + error.code);
            this.errorMessage = "Sorry, something went wrong, please try again";
          }

        })


      console.log("Form submitted!");
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
