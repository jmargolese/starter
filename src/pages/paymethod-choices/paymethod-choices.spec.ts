import { PaymethodChoicesPage } from './paymethod-choices';

import { ViewController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PlatformMock, NavParamsMock, ViewControllerMock } from '../../../test-config/mocks-ionic';

describe('PaymethodChoicesPage', () => {
  let comp: PaymethodChoicesPage;
  let fixture: ComponentFixture<PaymethodChoicesPage>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymethodChoicesPage],
      imports: [
        IonicModule.forRoot(PaymethodChoicesPage)
      ],
      providers: [
        NavController,
        { provide: Platform, useClass: PlatformMock},
        { provide: ViewController, useClass: ViewControllerMock },
        { provide: NavParams, useClass: NavParamsMock }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymethodChoicesPage);
    comp = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
  });

  it('test page creation: PaymethodChoicesPage', () => {
    expect(comp).toBeDefined();
  });

  it('test PaymethodChoices: expect Add credit card text', () => {
    fixture.detectChanges();
    de = fixture.debugElement.query(By.css('ion-col:nth-child(2)'));
    expect(de.nativeElement.innerText).toMatch('Add credit card'); 
  });

});

