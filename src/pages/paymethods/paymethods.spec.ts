import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { UserProvider } from '../../share-common/providers/user/user';
import { PaymethodsProvider } from '../../share-common/providers/paymethods/paymethods';
import { NavParams } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { PaymethodsPage } from './paymethods';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformMock, StatusBarMock, SplashScreenMock,  NavParamsMock } from '../../../test-config/mocks-ionic';
import { AnalyticsProviderMock, UserProviderMock, PaymethodsProviderMock } from '../../../test-config/mocks-ionic';

describe('PaymethodsPage', () => {
  let comp: PaymethodsPage;
  let fixture: ComponentFixture<PaymethodsPage>;
  let de:      DebugElement;      //Element to test
  let el:      HTMLElement;       //HMTL of elemen


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
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        { provide: UserProvider, useClass: UserProviderMock },
        { provide: PaymethodsProvider, useClass: PaymethodsProviderMock },
        { provide: NavParams, useClass: NavParamsMock }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymethodsPage);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('ion-title'));
  });

  it('should create component', () => expect(comp).toBeDefined());

  it('should have expected ion-title text', () => {
    fixture.detectChanges();
    const iontitle = de.nativeElement;
    expect(iontitle.innerText).toMatch('Paymethods');
  });
});

