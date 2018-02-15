import { OrganizationProvider } from './../../share-common/providers/organization/organization';
import { OrgHomePage } from './org-home';

import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { ActivitiesProvider } from '../../share-common/providers/activities/activities';
import { UserProvider } from './../../share-common/providers/user/user';

import { ComponentsModule } from '../../share-common/components/components.module';
import { NavParams } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PlatformMock, StatusBarMock, SplashScreenMock,  NavParamsMock } from '../../../test-config/mocks-ionic';
import { AnalyticsProviderMock, ActivitiesProviderMock, UserProviderMock, OrganizationProviderMock , ErrorReporterProviderMock} from '../../../test-config/mocks-ionic';
import { ErrorReporterProvider } from '../../share-common/providers/error-reporter/error-reporter';

describe('OrgHomePage', () => {

  let comp: OrgHomePage;
  let fixture: ComponentFixture<OrgHomePage>;
  let de: DebugElement;

   beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrgHomePage],
      imports: [
        IonicModule.forRoot(OrgHomePage),
        ComponentsModule
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        { provide: ActivitiesProvider, useClass: ActivitiesProviderMock },
        { provide: OrganizationProvider, useClass: OrganizationProviderMock },
        { provide: UserProvider, useClass: UserProviderMock },
        { provide: NavParams, useClass: NavParamsMock },
        { provide: ErrorReporterProvider, useClass: ErrorReporterProviderMock }
      ]
    });
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(OrgHomePage);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('ion-title'));
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
  });

  it('test page creation: OrgHomePage', () => {
    expect(comp).toBeDefined();
  });

  it('test constructor: expect blank title', () => {
    fixture.detectChanges();
    expect(de.nativeElement.innerText).toMatch('');
  });
})

