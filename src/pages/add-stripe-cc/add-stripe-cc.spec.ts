import { AddStripeCcPage } from './add-stripe-cc';

import { PaymethodsProvider } from '../../share-common/providers/paymethods/paymethods';
import { AlertProvider } from '../../share-common/providers/alert/alert';
import { UserProvider } from '../../share-common/providers/user/user';
import { StripeProvider } from '../../share-common/providers/stripe/stripe';

import { NavParams } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Stripe } from '@ionic-native/stripe';

import { PlatformMock, StatusBarMock, SplashScreenMock,  NavParamsMock, StripeMock, ViewControllerMock } from '../../../test-config/mocks-ionic';
import { UserProviderMock, PaymethodsProviderMock, AlertProviderMock, StripeProviderMock } from '../../../test-config/mocks-ionic';


describe('AddStripeCcPage', () => {
  let comp: AddStripeCcPage;
  let fixture: ComponentFixture<AddStripeCcPage>;
  let de:      DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddStripeCcPage],
      imports: [
        IonicModule.forRoot(AddStripeCcPage)
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: UserProvider, useClass: UserProviderMock },
        { provide: PaymethodsProvider, useClass: PaymethodsProviderMock },
        { provide: AlertProvider, useClass: AlertProviderMock },
        { provide: StripeProvider, useClass: StripeProviderMock },
        { provide: Stripe, useClass: StripeMock },
        { provide: ViewController, useClass: ViewControllerMock },
        { provide: NavParams, useClass: NavParamsMock }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStripeCcPage);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('ion-title'));
  });

  it('should create component', () => expect(comp).toBeDefined());

  it('should have expected ion-title text', () => {
    fixture.detectChanges();
    const iontitle = de.nativeElement;
    expect(iontitle.innerText).toMatch('Add credit card');
  });
});

