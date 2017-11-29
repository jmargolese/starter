import { PaymethodsPage } from './paymethods';

import { PaymethodsProvider } from '../../share-common/providers/paymethods/paymethods';
import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { UserProvider } from '../../share-common/providers/user/user';

import { NavParams } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PlatformMock, StatusBarMock, SplashScreenMock,  NavParamsMock } from '../../../test-config/mocks-ionic';
import { PaymethodsProviderMock, AnalyticsProviderMock, UserProviderMock } from '../../../test-config/mocks-ionic';

describe('PaymethodsPage', () => {
  let comp: PaymethodsPage;
  let fixture: ComponentFixture<PaymethodsPage>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymethodsPage],
      imports: [
        IonicModule.forRoot(PaymethodsPage)
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide:PaymethodsProvider, useClass: PaymethodsProviderMock },
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        { provide: UserProvider, useClass: UserProviderMock },
        { provide: NavParams, useClass: NavParamsMock }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymethodsPage);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('ion-title'));
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
  });

  it('test page creation: create PaymethodsPage component', () => {
    expect(comp).toBeDefined();
  });

  it('test constructor: expect Paymethods title', () => {
    fixture.detectChanges();
    expect(de.nativeElement.innerText).toMatch('Paymethods');
  });
});

