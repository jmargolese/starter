import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { AuthProvider } from '../../share-common/providers/auth/auth';
import { NavParams } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SettingsPasscodePage } from './settings-passcode';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformMock, StatusBarMock, SplashScreenMock, AnalyticsProviderMock, AuthProviderMock, NavParamsMock } from '../../../test-config/mocks-ionic';

describe('SettingsPasscodePage', () => {
  let comp: SettingsPasscodePage;
  let fixture: ComponentFixture<SettingsPasscodePage>;
  let de:      DebugElement;      //Element to test
  let el:      HTMLElement;       //HMTL of elemen


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsPasscodePage],
      imports: [
        IonicModule.forRoot(SettingsPasscodePage)
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        { provide: AuthProvider, useClass: AuthProviderMock },
        { provide: NavParams, useClass: NavParamsMock }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPasscodePage);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('ion-title'));
  });

  it('should create component', () => expect(comp).toBeDefined());

  it('should have expected ion-title text', () => {
    fixture.detectChanges();
    const iontitle = de.nativeElement;
    expect(iontitle.innerText).toMatch('Change passcode');
  });
});

