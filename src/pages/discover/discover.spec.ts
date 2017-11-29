import { DiscoverPage } from './discover';

import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { OrganizationProvider } from '../../share-common/providers/organization/organization';

import { ComponentsModule } from '../../share-common/components/components.module';
import { NavParams } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';

import { PlatformMock, NavParamsMock } from '../../../test-config/mocks-ionic';
import { AnalyticsProviderMock, OrganizationProviderMock } from '../../../test-config/mocks-ionic';

describe('DiscoverPage', () => {

  let comp: DiscoverPage;
  let fixture: ComponentFixture<DiscoverPage>;
  let de: DebugElement;

   beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoverPage],
      imports: [
        IonicModule.forRoot(DiscoverPage),
        ComponentsModule
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        { provide: OrganizationProvider, useClass: OrganizationProviderMock },
        { provide: NavParams, useClass: NavParamsMock }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverPage);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('ion-title'));
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
  });

  it('test page creation: expect DiscoverPage component', () => {
    expect(comp).toBeDefined();
  }); 

  it('test constructor: expect Discover title', () => {
    fixture.detectChanges();
    expect(de.nativeElement.innerText).toMatch('Discover');
  });

  it('test setTitle: expect mockTitle title', () => {
    comp.setTitle('mockTitle');
    fixture.detectChanges();
    expect(de.nativeElement.innerText).toMatch('mockTitle');    
  });

  it('test ionViewWillEnter: expect organizations contain mockOrganization', () => {
    comp.ionViewWillEnter();
    expect(JSON.stringify(comp.organizations)).toContain('mockOrganization');
  });
});


