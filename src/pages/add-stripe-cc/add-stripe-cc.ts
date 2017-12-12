import { PaymethodsProvider } from './../../share-common/providers/paymethods/paymethods';
import { AlertProvider } from './../../share-common/providers/alert/alert';
//import { Page } from './../../../e2e/app.po';

import { UserProvider } from './../../share-common/providers/user/user';
import { StripeProvider } from './../../share-common/providers/stripe/stripe';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stripe } from '@ionic-native/stripe';

import * as shareTypes from '../../share-common/interfaces/interfaces';

import { ENV } from '@app/env';

/**
 * Generated class for the AddStripeCcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



@IonicPage()
@Component({
  selector: 'page-add-stripe-cc',
  templateUrl: 'add-stripe-cc.html',
})


export class AddStripeCcPage {


  public title: string = "Add credit card";
  public ccForm: FormGroup;
  public errorMessage: string = "";
  public submitAttempt: boolean = false;
  public ccType: string = "";
  public cvcLength: number = 3;
  private prevCCType: string = null;
  private loading;

  constructor(public payMethProvider: PaymethodsProvider, public navCtrl: NavController, public navParams: NavParams,
    public userProvider: UserProvider, public stripe: Stripe, public formBuilder: FormBuilder, public alert: AlertProvider,
    public viewCtrl: ViewController, public stripeProvider: StripeProvider, private loadingCtrl: LoadingController) {

    this.stripe.setPublishableKey(ENV.stripe.privateKey);

    this.ccForm = formBuilder.group({
      cardholder: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      nickname: ['', Validators.compose([Validators.maxLength(10),Validators.pattern('[a-zA-Z \']*')])],
      cardnumber: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      expirationDate: ['', Validators.compose([Validators.maxLength(5), Validators.required])],
      cvc: ['', Validators.compose([Validators.maxLength(this.cvcLength), Validators.required])],
      postalCode: ['', Validators.compose([Validators.maxLength(11), Validators.required])]

    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddStripeCcPage');
  }

  public cardNumberBlurred(value: string) {

    var cardNum: string = value.replace(/\s+/g, '');       // remove spaces

    this.stripe.validateCardNumber(cardNum)
      .then(() => {
        console.log("Credit card number is ok: " + value);
        this.ccForm.controls.cardnumber.setErrors(null);
      })
      .catch(() => {
        // there is an error, but we get no info
        console.error("Credit card number error: ");
        this.ccForm.controls.cardnumber.setErrors({ 'Invalid': true });
      })
  }



  public cardNumberChanged(value: string) {

    // don't add a space if it's the last character, screws up delete

    if (this.ccType && this.ccType.toLowerCase() != 'american express') {
      if (value && value.length < 19 && value.length != 14 && value.length != 4 && value.length != 9)
        this.ccForm.controls.cardnumber.setValue(value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 '));
    } else {
      if (value && value.length < 17 && value.length != 4 && value.length != 11)
        this.ccForm.controls.cardnumber.setValue(value.replace(/\b(\d{4})(\d{6})(\d{5})\b/, '$1 $2 $3'));
    }

    if (value && value.length > 3) {
      this.stripe.getCardType(value)
        .then(type => {
          console.log("Credit card type: " + type);
          this.ccType = (type == "Unknown" ? "" : type.toLowerCase());
          // cvc code length is 4 if it is amex, otherwise always 3 (for now).
          if (type != this.prevCCType) {
            this.prevCCType = type;
            this.cvcLength = this.ccType && this.ccType == 'american express' ? 4 : 3;
            this.ccForm.controls.cvc.setValidators(Validators.compose([Validators.maxLength(this.cvcLength), Validators.required]));

          }
        })
        .catch(() => {
          this.ccType = null;
        })
    } else    // too short? No type
      this.ccType = null;
  }

  public expirationDateChanged(value: string) {

    if (value && value.length != 2 && value.length <= 4) {
      this.ccForm.controls.expirationDate.setValue(value.replace(/\W/gi, '').replace(/(.{2})/g, '$1\/'));
    }

    if (value && value.length == 5)
      this.validateExpirationDate(value);
  }



  public validateExpirationDate(value: string) {
    var expirationDate: string = value.replace(/\s+/g, '').replace(/\/+/g, '');       // remove spaces and /
    if (expirationDate && expirationDate.length == 4) {
      this.stripe.validateExpiryDate(expirationDate.substr(0, 2), expirationDate.substr(2, 2))
        .then(() => {
          this.ccForm.controls.expirationDate.setErrors(null);
        })
        .catch((error) => {
          console.error("Expiration date error: " + (error ? JSON.stringify(error) : "no error returned"));
          this.ccForm.controls.expirationDate.setErrors({ 'Invalid': true });
        })

    } else {     // wrong length
      this.ccForm.controls.expirationDate.setErrors({ 'Invalid': true });
    }

  }

  public validateCVC(value: string) {

    if (value && value.length == this.cvcLength) {
      this.stripe.validateCVC(value)
        .then(() => {
          this.ccForm.controls.cvc.setErrors(null);
        })
        .catch((error) => {

          this.ccForm.controls.cvc.setErrors({ 'Invalid': true });
        })

    } else {     // wrong length
      this.ccForm.controls.cvc.setErrors({ 'Invalid': true });
    }

  }
  public cancel() {
    // add the empty catch to deal with an Ionic bug throughing and exception https://github.com/ionic-team/ionic/issues/11776#issuecomment-314050068
    let data = { canceled: true };
    this.viewCtrl.dismiss(data)
      .catch(() => { });
  }

  public submit() {

    this.submitAttempt = true;

    if (!this.ccForm.valid) {
      this.errorMessage = "Please correct errors and resubmit";
      console.error("form is not valid");
    } else {

      var expirationDate: string = this.ccForm.controls.expirationDate.value.replace(/\s+/g, '').replace(/\/+/g, '');       // remove spaces and /
      var cardnumber = this.ccForm.controls.cardnumber.value.replace(/\s+/g, '');       // remove spaces

      let card = {
        name: this.ccForm.controls.cardholder.value,
        number: cardnumber,
        expMonth: expirationDate.substr(0, 2),
        expYear: expirationDate.substr(2, 2),
        cvc: this.ccForm.controls.cvc.value,
        postal_code: this.ccForm.controls.postalCode.value
      }

      console.log("About to submit credit card: " + JSON.stringify(card));

      this.loading = this.loadingCtrl.create({ content: '' });
      this.loading.present()
        .then(() => {
          this.stripe.createCardToken(<any>card)
            .then(token => {

              console.log("Created stripe token: " + JSON.stringify(token));

              this.submitAttempt = false;

              let newStripeToken: shareTypes.StripeToken = {
                userId: this.userProvider.getUserId(),
                nickname: this.ccForm.controls.nickname.value || '',
                token: token
              };

              this.stripeProvider.submitStripeToken(newStripeToken)
                .then(() => {
                  console.log('Token submitted to the cloud');
                  if (this.loading ) { this.loading.dismiss().catch(); this.loading = null; }
                  this.alert.confirm({ title: "Success", message: "Your credit card has been added", buttons: { ok: true, cancel: false } })
                    .then(() => {
                      // this.viewCtrl.dismiss({  error: false, canceled: false, newPaymethod: newPaymethod });
                      this.viewCtrl.dismiss({ error: false, canceled: false });
                    });
                }).catch(error => {
                  console.error(`stripeProvider.submitStripeToken rejected with error: ${error}`);
                  if (this.loading ) { this.loading.dismiss().catch(); this.loading = null; }
                  this.alert.confirm({ title: "Error", message: error, buttons: { ok: true, cancel: false } });
                });
            }).catch(error => {
              if (this.loading ) { this.loading.dismiss().catch(); this.loading = null; }
              console.error("Stripe token rejected with error: " + JSON.stringify(error));
              this.alert.confirm({ title: "Error", message: error, buttons: { ok: true, cancel: false } });
            });
        });
    }
  }
}
