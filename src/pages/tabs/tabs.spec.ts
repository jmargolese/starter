import { AlertProvider } from './../../share-common/providers/alert/alert';
import { ErrorReporterProvider } from './../../share-common/providers/error-reporter/error-reporter';
import { AuthProviderMock, ErrorReporterProviderMock, AlertProviderMock } from './../../../test-config/mocks-ionic';
import { AuthProvider } from './../../share-common/providers/auth/auth';
import { UserProvider } from './../../share-common/providers/user/user';
import { OrganizationProvider } from './../../share-common/providers/organization/organization';
import { TabsPage } from './tabs';

import { NotificationsProvider } from './../../share-common/providers/notifications/notifications';

import { NavParams } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';

import { NotificationsProviderMock, OrganizationProviderMock, ActivitiesProviderMock } from '../../../test-config/mocks-ionic';
import { PlatformMock, NavParamsMock, SocialShareProviderMock, UserProviderMock } from '../../../test-config/mocks-ionic';
import { ComponentsModule } from '../../share-common/components/components.module';
import { NavMock } from '../../../test-config/mocks-ionic';
import { SocialShareProvider } from '../../share-common/providers/social-share/social-share';
import { ActivitiesProvider } from '../../share-common/providers/activities/activities';

describe('TabsPage', () => {

  let comp: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

   beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabsPage],
      imports: [
        IonicModule.forRoot(TabsPage),
        ComponentsModule
      ],
      providers: [
        { provide: NavController, useClass: NavMock},
        { provide: NotificationsProvider, useClass: NotificationsProviderMock},
        { provide: Platform, useClass: PlatformMock},
        { provide: NavParams, useClass: NavParamsMock },
        { provide: SocialShareProvider, useClass: SocialShareProviderMock},
        { provide: OrganizationProvider, useClass: OrganizationProviderMock},
        { provide: ActivitiesProvider, useClass: ActivitiesProviderMock},
        { provide: UserProvider, useClass: UserProviderMock },
        { provide: AuthProvider, useClass: AuthProviderMock},
        { provide: ErrorReporterProvider, useClass: ErrorReporterProviderMock},
        { provide: AlertProvider, useClass: AlertProviderMock}
      ]
    });
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    comp = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
  });

  it('test page creation: TabsPage', () => {
    expect(comp).toBeDefined();
  }); 
})
