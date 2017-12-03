import { TabsPage } from './tabs';

import { NotificationsProvider } from './../../share-common/providers/notifications/notifications';

import { Deeplinks } from '@ionic-native/deeplinks';
import { NavParams } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform, NavController} from 'ionic-angular/index';

import { NotificationsProviderMock } from '../../../test-config/mocks-ionic';
import { PlatformMock, NavParamsMock } from '../../../test-config/mocks-ionic';
import { ComponentsModule } from '../../share-common/components/components.module';
import { NavMock } from '../../../test-config/mocks-ionic';

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
        Deeplinks,
        { provide: NavController, useClass: NavMock},
        { provide: NotificationsProvider, useClass: NotificationsProviderMock},
        { provide: Platform, useClass: PlatformMock},
        { provide: NavParams, useClass: NavParamsMock }
      ]
    });
  }));
  
  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    comp = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    comp = null;
  });

  it('test page creation: TabsPage', () => {
    expect(comp).toBeDefined();
  }); 
})
