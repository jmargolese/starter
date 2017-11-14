import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { AuthProvider } from '../../share-common/providers/auth/auth';
import { NavParams } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SettingsPage } from './settings';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformMock, StatusBarMock, SplashScreenMock, AnalyticsProviderMock, AuthProviderMock, NavParamsMock, AppVersionMock } from '../../../test-config/mocks-ionic';

describe('SettingsPage', () => {
  let comp: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let de:      DebugElement;      //Element to test
  let el:      HTMLElement;       //HMTL of elemen


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsPage],
      imports: [
        IonicModule.forRoot(SettingsPage)
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        { provide: AuthProvider, useClass: AuthProviderMock },
        { provide: NavParams, useClass: NavParamsMock },
        { provide: AppVersion, useClass: AppVersionMock },
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPage);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('ion-title'));
  });

  it('should create component', () => expect(comp).toBeDefined());

  it('should have expected ion-title text', () => {
    fixture.detectChanges();
    const iontitle = de.nativeElement;
    expect(iontitle.innerText).toMatch('Settings');
  });
});

