import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Share } from './app.component';
import { PlatformMock } from '../../test-config/mocks-ionic';

describe('Share Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Share],
      imports: [
        IonicModule.forRoot(Share)
      ],
      providers: [
        StatusBar,
        SplashScreen,
        { provide: Platform, useClass: PlatformMock }
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Share);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

  it ('should be created', () => {
    expect(component instanceof Share).toBe(true);
  });

  it('is created', () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('initializes with a root page of TabsPage', () => {
    expect(component['rootPage']).toBe('TabsPage');
  })
});
