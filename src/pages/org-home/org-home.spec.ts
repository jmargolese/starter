import { OrgHomePage } from './org-home';
import { AnalyticsProvider } from '../../share-common/providers/analytics/analytics';
import { ActivitiesProvider } from '../../share-common/providers/activities/activities';
import { PlatformMock, StatusBarMock, SplashScreenMock,  NavParamsMock } from '../../../test-config/mocks-ionic';
import { AnalyticsProviderMock, ActivitiesProviderMock } from '../../../test-config/mocks-ionic';
import { ComponentsModule } from '../../share-common/components/components.module';
import { NavParams } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

describe('OrgHomePage', () => {

  let comp: OrgHomePage;
  let fixture: ComponentFixture<OrgHomePage>;

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
        { provide: NavParams, useClass: NavParamsMock }
      ]
    });
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(OrgHomePage);
    comp = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(comp).toBeDefined();
  }); 
})

