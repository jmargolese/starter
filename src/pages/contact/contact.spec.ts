import { ContactPage } from './contact';

import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { AuthProvider } from '../../share-common/providers/auth/auth';
import { DataProvider } from '../../share-common/providers/data/data';
import { UserProvider } from '../../share-common/providers/user/user';

import { NavParams } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PlatformMock, StatusBarMock, SplashScreenMock,  NavParamsMock, AppVersionMock } from '../../../test-config/mocks-ionic';
import { AnalyticsProviderMock, AuthProviderMock, DataProviderMock, UserProviderMock, AngularFirestoreMock } from '../../../test-config/mocks-ionic';

describe('ContactPage', () => {
  let comp: ContactPage;
  let fixture: ComponentFixture<ContactPage>;
  let de:      DebugElement;      //Element to test

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactPage],
      imports: [
        IonicModule.forRoot(ContactPage)
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        { provide: AuthProvider, useClass: AuthProviderMock },
        { provide: DataProvider, useClass: DataProviderMock },
        { provide: UserProvider, useClass: UserProviderMock },
        { provide: NavParams, useClass: NavParamsMock },
        { provide: AppVersion, useClass: AppVersionMock },
        { provide: AngularFirestore, useClass: AngularFirestoreMock },
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPage);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('ion-title'));
  });

  it('should create component', () => expect(comp).toBeDefined());

  it('should have expected ion-title text', () => {
    fixture.detectChanges();
    const iontitle = de.nativeElement;
    expect(iontitle.innerText).toMatch('Contact');
  });
});

