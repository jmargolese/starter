import {} from 'jasmine';
import { TabsPage } from './../pages/tabs/tabs';
import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Share } from './app.component';


import {
PlatformMock,
StatusBarMock,
SplashScreenMock
} from '../../test-config/mocks-ionic';
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
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock }
      ]
    })
  }));
beforeEach(() => {
fixture = TestBed.createComponent(Share);
component = fixture.componentInstance;
  });
it('should be created', () => {
expect(component instanceof Share).toBe(true);
  });
/* it('should have two pages', () => {
expect(component.pages.length).toBe(2);
  }); */

  it('initialises with a root page of HomePage', () => {
    expect(component['rootPage']).toBe(TabsPage);
});
});