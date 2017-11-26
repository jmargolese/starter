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
  let de: DebugElement;      //Element to test

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

  it('should create component', () => {
    expect(comp).toBeDefined();
  });
  
  it('should have expected ion-title text', () => {
    fixture.detectChanges();
    const iontitle = de.nativeElement;
    expect(iontitle.innerText).toMatch('Discover');
  });
})

