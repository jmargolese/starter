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
export class PaymethodsProviderMock {}
export class ActivitiesProviderMock {}
export class SocialSharingMock {}

export class ShareProviderMock {
  public donate() {
    return new Promise( (resolve, reject) => { 
      resolve();
    })
  } 
}

export class AuthProviderMock {
  public getAuthenticatedUser() {
    return new Promise( (resolve, reject) => { 
      resolve(true);
    })
  }  
}

export class DataProviderMock {
  activity = null;
  donation = null;
  organization = null;
  public getActivitiesForOrg() {
    return new Promise( (resolve, reject) => { 
      resolve(this.activity);
    })
  }
  public getDonationRecords() {
    return new Promise( (resolve, reject) => { 
      resolve(this.donation);
    })
  }   
  public getAllOrganizations() {
    return new Promise( (resolve, reject) => { 
      resolve(this.organization);
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
  };
  currentAuthUser = 'mockAuthUser';
  mockUserHasOrganization = true;
  public getUserProfile() {
    return (this.currentUser);
  };
  public getUserId() {
    return (this.currentAuthUser);
  };
   public userHasOrganization() {
    return (this.mockUserHasOrganization);
  };
  public isUserFavorite(type, id) {
    return (false);
  };
  public userLikesOrganization(type, id) {
    return (false);
  };
}

export class NavParamsMock {
  activity: shareTypes.Activity = {
    "id": "mock",
    "organization": "orgAlive",
    "info": {
        "type": "Campaign",
        "featured": false,
        "promoted": false,
        "displayOrder": 0,
        "shareuid": "ALIVE",
        "enabled": true,
    },
    "images": {
        "image": null,
        "logo": null
    },
    "messages": {
        "headline": "mockHeadline",
        "mainMessage": "mockMessage",
        "callToAction": "mockCalToAction",
        "motd": null
    },
    "dates": {
        "startDate": "2017-10-25",
        "endDate": "2017-11-15",
        "activityDate": null,
        "activeDateStart": null,
        "activeDateEnd": null,
        "activeDateTimer": null
    },
    "social": null,
    "parent": null,
    "children": null,
    "metadata" : null
  };

  organization: shareTypes.Organization = {
    "id": 'mockId',
    "companyName": 'mockcompanyName',
    "ein": 'mockein',
    "shareuid": 'mockshareuid',
    "images": {
        "image": 'mockimage',
        "logo": 'mocklogo'
    },
    "social": {
      "message": null,
      "hashTags": null,
      "subject": null
    },
    "info": {
        "coreMessage": 'mockcoreMessage',
        "isDemo": true,
        "description": 'mockdescription',
        "enabled": true
    },
    "donationPrefs": [100],
    "payMethods": [
        {
            "type": 'mockType',
            "data": 0
        }
    ],
    "metadata": null
  };

  public get(key): any {
    switch (key) {
      case 'activity':
        return(this.activity);
      case 'organization':
        return(this.organization);
    }
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
  organizations = null;
  public getAllOrganizations() {
    return new Promise( (resolve, reject) => {
     resolve(this.organizations)
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