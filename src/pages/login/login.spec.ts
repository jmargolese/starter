import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { AuthProvider } from '../../share-common/providers/auth/auth';
import { UserProvider } from '../../share-common/providers/user/user';
import { UserProfile, UserContactPrefs } from './../../share-common/interfaces/interfaces.d';
import { AlertProvider } from './../../share-common/providers/alert/alert';
import { IonicPage, ToastController, ViewController, AlertController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { LoginPage } from './login';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformMock, StatusBarMock, SplashScreenMock,  NavParamsMock } from '../../../test-config/mocks-ionic';
import { AnalyticsProviderMock, AuthProviderMock, UserProviderMock, AlertProviderMock } from '../../../test-config/mocks-ionic';
import { ViewControllerMock } from '../../../test-config/mocks-ionic';

describe('LoginPage', () => {
  let comp: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let de:      DebugElement;      //Element to test
  let el:      HTMLElement;       //HMTL of elemen


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [
        IonicModule.forRoot(LoginPage)
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        { provide: AuthProvider, useClass: AuthProviderMock },
        { provide: UserProvider, useClass: UserProviderMock },
        { provide: AlertProvider, useClass: AlertProviderMock },
        { provide:ViewController, useClass: ViewControllerMock },
        { provide: NavParams, useClass: NavParamsMock }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('ion-title'));
  });

  it('should create component', () => expect(comp).toBeDefined());

  it('should have expected ion-title text', () => {
    fixture.detectChanges();
    const iontitle = de.nativeElement;
    expect(iontitle.innerText).toMatch('Sign-in');
  });
});

