import { ImpactPage } from './impact';

import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { AuthProvider } from '../../share-common/providers/auth/auth';
import { DataProvider } from '../../share-common/providers/data/data';
import { UserProvider } from '../../share-common/providers/user/user';

import { NavParams } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';

import { PlatformMock, NavParamsMock, AppVersionMock } from '../../../test-config/mocks-ionic';
import { AnalyticsProviderMock, AuthProviderMock, DataProviderMock, UserProviderMock } from '../../../test-config/mocks-ionic';

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

  it('test updateDonations: expect donations to be defined', () => {
    comp.updateDonations();
    expect(comp.donations).toBeDefined();
  });

  it('test ionViewWillEnter: expect userHasOrganization to be true and donations to be defined', () => {
    comp.ionViewWillEnter();
    expect(comp.userHasOrganization).toBeTruthy();
    expect(comp.donations).toBeDefined();
  });

  it('test selectionChanged: expect donations donations to be defined', () => {
    comp.selectionChanged(event);
    expect(comp.donations).toBeDefined();
  });
});
