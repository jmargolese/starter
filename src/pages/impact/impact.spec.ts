import { Device } from '@ionic-native/device';
import { ErrorReporterProviderMock, DeviceMock } from './../../../test-config/mocks-ionic';
import { ErrorReporterProvider } from './../../share-common/providers/error-reporter/error-reporter';
import { ImpactPage } from './impact';

import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { AuthProvider } from '../../share-common/providers/auth/auth';
import { DataProvider } from '../../share-common/providers/data/data';
import { UserProvider } from '../../share-common/providers/user/user';
import { OrganizationProvider } from './../../share-common/providers/organization/organization';

import { NavParams } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';

import { PlatformMock, NavParamsMock, AppVersionMock } from '../../../test-config/mocks-ionic';
import { AnalyticsProviderMock, AuthProviderMock, DataProviderMock, UserProviderMock, OrganizationProviderMock } from '../../../test-config/mocks-ionic';

describe('ImpactPage', () => {
  let comp: ImpactPage;
  let fixture: ComponentFixture<ImpactPage>;
  let de: DebugElement; 

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImpactPage],
      imports: [
        IonicModule.forRoot(ImpactPage)
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        { provide: AuthProvider, useClass: AuthProviderMock },
        { provide: DataProvider, useClass: DataProviderMock },
        { provide: UserProvider, useClass: UserProviderMock },
        { provide: NavParams, useClass: NavParamsMock },
        { provide: AppVersion, useClass: AppVersionMock },
        { provide: OrganizationProvider, useClass: OrganizationProviderMock},
        { provide: ErrorReporterProvider, useClass: ErrorReporterProviderMock},
        { provide: Device, useClass: DeviceMock}
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactPage);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('ion-title'));
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
  });

  it('test page creation: ImpactPage', () => {
    expect(comp).toBeDefined();
  }); 

  it('test constructor: expect Dashboard title', () => {
    fixture.detectChanges();
    expect(de.nativeElement.innerText).toMatch('Dashboard');
  });

  it('test updateDonations: expect donations set', () => {
    comp.updateDonations();
    expect(comp.donations).toBeDefined();
  });

  it('test ionViewWillEnter: expect userHasOrganization to be true and donations set', () => {
    comp.userProvider.currentUser.organization = "orgID";
    comp.ionViewWillEnter();
    
    expect(comp.userHasOrganization).toBeTruthy();
    expect(comp.donations).toBeDefined();
  });

  it('test ionViewWillEnter: expect userHasOrganization to be false ', () => {
    comp.userProvider.currentUser.organization = "";
    comp.ionViewWillEnter();
    
    expect(comp.userHasOrganization).toBeFalsy();
  });

  it('test selectionChanged: expect donations set', () => {
    comp.selectionChanged(event);
    expect(comp.donations).toBeDefined();
  });
});
