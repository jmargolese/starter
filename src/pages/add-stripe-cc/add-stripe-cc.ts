import { UserProvider } from './../../providers/user/user';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  @ViewChild('card-number') cardNumber;
  @ViewChild('stripeForm') stripeForm;
  public data = {
    "cardholder": this.userProvider.getDisplayName(),
    "postalCode": ''
  };

  public stripe: any;
  public elements: any;

  public style = {
    base: {
      backgroundColor: '#FFFFFF',
      iconColor: '#666EE8',
      color: '#31325F',
      lineHeight: '40px',
      fontWeight: 300,
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSize: '15px',

      '::placeholder': {
        color: '#CFD7E0',
      },
    },
  }

  //tom styling can be passed to options when creating an Element.

  /**  ??????? */
  public style222 = {
    base: {
      // Add your base input styles here. For example:
      fontSize: '16px',
      lineHeight: '38px',
      height: '38px'
    }
  };

  public cardBrandToPfClass = {
    'visa': 'pf-visa',
    'mastercard': 'pf-mastercard',
    'amex': 'pf-american-express',
    'discover': 'pf-discover',
    'diners': 'pf-diners',
    'jcb': 'pf-jcb',
    'unknown': 'pf-credit-card',
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider) {
    this.stripe = (<any>window).Stripe("pk_test_guQgqDNKwgXdd5MokoH926oj");
    this.elements = this.stripe.elements();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddStripeCcPage');
  }


  public cancel() {
    //$scope.closeAddPayMethodModal({ cancel: true });
  }


  public init() {
    let cardNumber = this.elements.create('cardNumber', { style: this.style });
    cardNumber.mount('#card-number');
    var cardExpiry = this.elements.create('cardExpiry', { style: this.style });
    cardExpiry.mount('#card-expiry');
    var cardCvc = this.elements.create('cardCvc', { style: this.style });
    cardCvc.mount('#card-cvc');
    var cardPostalCode = this.elements.create('postalCode', { style: this.style });
    cardPostalCode.mount('#card-postal-code');

    this.cardNumber.changes.subscribe('change', function (event) {
      if (event.brand) {
        this.setBrandIcon(event.brand);
      }
      this.setOutcome(event);
    });

    this.stripeForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var form = document.querySelector('form');
      var extraDetails = {
        name: this.stripeForm.querySelector('input[name=cardholder-name]').value,
      };
      this.stripe.createToken(cardNumber, extraDetails)
        .then(function (result) {
          this.setOutcome(result);

        });
    });
  }



  public setBrandIcon(brand) {
    var brandIconElement = document.getElementById('brand-icon');
    var pfClass = 'pf-credit-card';
    if (brand in this.cardBrandToPfClass) {
      pfClass = this.cardBrandToPfClass[brand];
    }
    for (var i = brandIconElement.classList.length - 1; i >= 0; i--) {
      brandIconElement.classList.remove(brandIconElement.classList[i]);
    }
    brandIconElement.classList.add('pf');
    brandIconElement.classList.add(pfClass);
  }




  public setOutcome(result) {

    var successElement = document.querySelector('.success');
    var errorElement = document.querySelector('.error');
    successElement.classList.remove('visible');
    errorElement.classList.remove('visible');

    if (result.token) {
      /*
      pmtFactory.addPayMethod(result.token)
        .then(function () {
          $scope.closeAddPayMethodModal({ success: true });
        }).catch(function (err) {
          console.error('addPayMethod Failure: ' + JSON.stringify(err));
          var errorMessage = "There was a problem adding this credit card. Please cancel and try again";
          if (err && err.data && err.data.error && err.data.message) {
            errorMessage = err.data.message;
          }

          errorElement.textContent = errorMessage;
          errorElement.classList.add('visible');
          */



    } else if (result.error) {
      errorElement.textContent = result.error.message;
      errorElement.classList.add('visible');
    }


  }







}
