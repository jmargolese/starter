import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as shareTypes from '../src/share-common/interfaces/interfaces';

export class PlatformMock {
  public ready(): Promise<string> {
    return new Promise((resolve) => {
      resolve('READY');
    });
  }

  public getQueryParam() {
    return true;
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return (() => true);
  }

  public hasFocus(ele: HTMLElement): boolean {
    return true;
  }

  public doc(): HTMLDocument {
    return document;
  }

  public is(): boolean {
    return true;
  }

  public getElementComputedStyle(container: any): any {
    return {
      paddingLeft: '10',
      paddingTop: '10',
      paddingRight: '10',
      paddingBottom: '10',
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(ele: any, eventName: string, callback: any): Function {
    return (() => true);
  }

  public win(): Window {
    return window;
  }

  public raf(callback: any): number {
    return 1;
  }

  public timeout(callback: any, timer: number): any {
    return setTimeout(callback, timer);
  }

  public cancelTimeout(id: any) {
    // do nothing
  }

  public getActiveElement(): any {
    return document['activeElement'];
  }
}

export class StatusBarMock extends StatusBar {
  styleDefault() {
    return;
  }
}

export class SplashScreenMock extends SplashScreen {
  hide() {
    return;
  }
}

export class NavMock {
 
  public pop(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }
 
  public push(): any {
    return new Promise(function(resolve: Function): void {
      resolve();
    });
  }
 
  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }
 
  public setRoot(): any {
    return true;
  }

  public registerChildNav(nav: any): void {
    return ;
  }

  public unregisterChildNav(nav: any) {
    return ;
  }

}

export class ViewControllerMock {
  
  public readReady: any = {
    emit(): void {},
    subscribe(): any {}
  };

  public writeReady: any = {
    emit(): void {},
    subscribe(): any {}
  };

  public contentRef(): any {
    return new Promise(function (resolve: Function): void {
        resolve();
    });
  }

  public didEnter(): any {
    return new Promise(function (resolve: Function): void {
        resolve();
    });
  }

  public didLeave(): any {
    return new Promise(function (resolve: Function): void {
        resolve();
    });
  }

  public onDidDismiss(): any {
    return new Promise(function (resolve: Function): void {
        resolve();
    });
  }

  public onWillDismiss(): any {
    return new Promise(function (resolve: Function): void {
        resolve();
    });
  }

  public willEnter(): any {
    return new Promise(function (resolve: Function): void {
        resolve();
    });
  }

  public willLeave(): any {
    return new Promise(function (resolve: Function): void {
        resolve();
    });
  }

  public willUnload(): any {
    return new Promise(function (resolve: Function): void {
        resolve();
    });
  }

  public dismiss(): any {
    return true;
  }

  public enableBack(): any {
    return true;
  }

  public getContent(): any {
    return true;
  }

  public hasNavbar(): any {
    return true;
  }

  public index(): any {
    return true;
  }

  public isFirst(): any {
    return true;
  }

  public isLast(): any {
    return true;
  }

  public pageRef(): any {
    return true;
  }

  public setBackButtonText(): any {
    return true;
  }

  public showBackButton(): any {
    return true;
  }

  public _setHeader(): any {
    return true;
  }

  public _setIONContent(): any {
    return true;
  }

  public _setIONContentRef(): any {
    return true;
  }

  public _setNavbar(): any {
    return true;
  }

  public _setContent(): any {
    return true;
  }

  public _setContentRef(): any {
    return true;
  }

  public _setFooter(): any {
    return true;
  }
}

export class StripeMock {}
export class AlertProviderMock {}
export class AnalyticsProviderMock {}
export class ShareProviderMock {}
export class PaymethodsProviderMock {}
export class AuthProviderMock {}
export class ActivitiesProviderMock {}
export class SocialSharingMock {}

export class DataProviderMock {
  b = 0;
  public getActivitiesForOrg() {
    return new Promise( (resolve, reject) => { 
      resolve(this.b)
    })
  }
}

export class UserProviderMock {
  currentUser: shareTypes.UserProfile = {
    name: {
      first: 'MockFirstName',
      last: 'MockLastName'
    },
    email: 'MockEmail',
    phoneNumber: '123-456-7890'
  }
  public getUserProfile() {
    return (this.currentUser);
  }
}

export class NavParamsMock {
  public get(key): any {
    return String(key) + 'Output';
  }
}

export class AngularFirestoreMock {
  b = 0;
  public collection() {
    return new Promise( (resolve, reject) => { 
      resolve(this.b)
    })
  }
}

export class OrganizationProviderMock {
  organization = 'mockedOrganization';
  public getAllOrganization() {
    return new Promise( (resolve, reject) => {
      resolve(this.organization)
    })
  }  
}

export class NotificationsProviderMock {
  b = 0;
  public init() {
    return new Promise( (resolve, reject) => {
      resolve(this.b)
    })
  }   
}

export class AppVersionMock {
  version = 20;
  name = 'mockedAppName';
  package = 'mockedAppPackage';
  code = 20;

  public getVersionNumber() {
    return new Promise( (resolve, reject) => {
      resolve(this.version)
    })
  }
  public getAppName() {
    return new Promise( (resolve, reject) => {
      resolve(this.name)
    })
  }
  public getPackageName() {
    return new Promise( (resolve, reject) => {
      resolve(this.package)
    })
  }

  public getVersionCode() {
    return new Promise( (resolve, reject) => {
      resolve(this.code)
    })
  }
}