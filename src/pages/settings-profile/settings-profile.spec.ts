import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';

import { AuthProvider } from '../../share-common/providers/auth/auth';
import { UserProvider } from '../../share-common/providers/user/user';

import { NavParams } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SettingsProfilePage } from './settings-profile';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PlatformMock, StatusBarMock, SplashScreenMock, AnalyticsProviderMock } from '../../../test-config/mocks-ionic';
import { AuthProviderMock, UserProviderMock, NavParamsMock } from '../../../test-config/mocks-ionic';

describe('SettingsProfilePage', () => {
  let comp: SettingsProfilePage;
  let fixture: ComponentFixture<SettingsProfilePage>;
  let de:      DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsProfilePage],
      imports: [
        IonicModule.forRoot(SettingsProfilePage),
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        { provide: AuthProvider, useClass: AuthProviderMock },
        { provide: UserProvider, useClass: UserProviderMock },
        { provide: NavParams, useClass: NavParamsMock }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsProfilePage);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('ion-title'));
  });

  it('should create component', () => expect(comp).toBeDefined());

  it('should have expected ion-title text', () => {
    fixture.detectChanges();
    const iontitle = de.nativeElement;
    expect(iontitle.innerText).toMatch('Profile');
  });
});

