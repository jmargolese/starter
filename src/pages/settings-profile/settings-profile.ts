import { UserProvider } from './../../share-common-providers/user/user';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


/**
 * Generated class for the SettingsProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings-profile',
  templateUrl: 'settings-profile.html',
})
export class SettingsProfilePage {

  public title: string = "Profile";
 public profileForm: FormGroup;

 public userProfile: any;
 public errorMessage:string = "Please correct errors and resubmit";

 public submitAttempt : boolean = false;
 public isError : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public userProvider: UserProvider) {

    this.userProfile = userProvider.getUserProfile();

    this.profileForm = formBuilder.group({
      firstName: [this.userProfile.name.first, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastName: [this.userProfile.name.last, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      phoneNumber: [this.userProfile.phoneNumber ]  //,*validation function goes here*, *asynchronous validation function goes here*]
  });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsProfilePage');
  }

  public changePasscode() {
    this.navCtrl.push('SettingsPasscodePage')
  }

  public update() {

    this.submitAttempt = true;

     if (!this.profileForm.valid) {
       console.error("form is not valid");
     } else {

      this.userProfile.name.first = this.profileForm.value.firstName;
      this.userProfile.name.last = this.profileForm.value.lastName;
      this.userProfile.phoneNumber = this.profileForm.value.phoneNumber;
      this.userProvider.updateProfileInfo(this.userProfile)
      .then(()=>{
        console.log('Updated user profile');
        this.submitAttempt = false;
      })
      .catch(error => {
        this.errorMessage = "Error sending update: " + error.message;
        console.error('Error updating profile info: ' + error.message);
      })

      
       console.log("Form submitted!");
     }
     
  }

}
