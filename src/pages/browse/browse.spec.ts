import { BrowsePage } from './browse';
import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { OrganizationProvider } from '../../share-common/providers/organization/organization';
import { PlatformMock, StatusBarMock, SplashScreenMock,  NavParamsMock } from '../../../test-config/mocks-ionic';
import { AnalyticsProviderMock, OrganizationProviderMock } from '../../../test-config/mocks-ionic';
import { ComponentsModule } from '../../share-common/components/components.module';
import { NavParams } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

describe('BrowsePage', () => {

  let comp: BrowsePage;
  let fixture: ComponentFixture<BrowsePage>;
  let de: DebugElement;      //Element to test

   beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BrowsePage],
      imports: [
        IonicModule.forRoot(BrowsePage),
        ComponentsModule
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: AnalyticsProvider, useClass: AnalyticsProviderMock },
        { provide: OrganizationProvider, useClass: OrganizationProviderMock },
        { provide: NavParams, useClass: NavParamsMock }
      ]
    });
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsePage);
    comp = fixture.componentInstance;
    de = fixture.debugElement.query(By.css('ion-title'));
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

