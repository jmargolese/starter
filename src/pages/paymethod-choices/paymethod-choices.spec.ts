import { PaymethodChoicesPage } from './paymethod-choices';

import { PaymethodsProvider } from '../../share-common/providers/paymethods/paymethods';
import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { UserProvider } from '../../share-common/providers/user/user';
import { AlertProvider } from './../../share-common/providers/alert/alert';

import { ViewController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PlatformMock, StatusBarMock, SplashScreenMock,  NavParamsMock, ViewControllerMock } from '../../../test-config/mocks-ionic';
import { PaymethodsProviderMock, AnalyticsProviderMock, UserProviderMock, AlertProviderMock } from '../../../test-config/mocks-ionic';

describe('PaymethodChoicesPage', () => {
  let comp: PaymethodChoicesPage;
  let fixture: ComponentFixture<PaymethodChoicesPage>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymethodChoicesPage],
      imports: [
        IonicModule.forRoot(PaymethodChoicesPage)
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide:PaymethodsProvider, useClass: PaymethodsProviderMock },
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        { provide: UserProvider, useClass: UserProviderMock },
        { provide: AlertProvider, useClass: AlertProviderMock },
        { provide: ViewController, useClass: ViewControllerMock },
        { provide: NavParams, useClass: NavParamsMock }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymethodChoicesPage);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('ion-title'));
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
  });

  it('test page creation: PaymethodChoicesPage', () => {
    expect(comp).toBeDefined();
  });

});

