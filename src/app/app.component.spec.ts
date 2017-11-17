import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';
import { Share } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBarMock, SplashScreenMock } from '../../test-config/mocks-ionic';
import { PlatformMock } from '../../test-config/mocks-ionic';

describe('Share Component', () => {
  let fixture;
  let comp;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Share],
      imports: [
        IonicModule.forRoot(Share)
      ],
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Share);
    comp = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
  });

  it('should create component', () => {
    expect(comp instanceof Share).toBe(true);
  });

  it('initializes with a root page of TabsPage', () => {
    expect(comp['rootPage']).toBe('TabsPage');
  })
});
