import { TabsPage } from './tabs';
import { NotificationsProvider } from './../../share-common/providers/notifications/notifications';
import { Deeplinks } from '@ionic-native/deeplinks';
import { NotificationsProviderMock, DeeplinksMock } from '../../../test-config/mocks-ionic';
import { PlatformMock, StatusBarMock, SplashScreenMock,  NavParamsMock } from '../../../test-config/mocks-ionic';
import { ComponentsModule } from '../../share-common/components/components.module';
import { NavParams } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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
        NavController,
        { provide: NotificationsProvider, useClass: NotificationsProviderMock},
        { provide: Deeplinks, useClass: DeeplinksMock},
        { provide: Platform, useClass: PlatformMock},
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: NavParams, useClass: NavParamsMock }
      ]
    });
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    comp = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(comp).toBeDefined();
  });
})

