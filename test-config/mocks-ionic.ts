import { ActivityTypes } from './../src/share-common/interfaces/interfaces.d';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as shareTypes from '../src/share-common/interfaces/interfaces';
import { Observable } from 'rxjs/Observable';

export class PlatformMock {

  public ready(): Promise<string> {
    return new Promise((resolve) => {
      resolve('READY');
    });
  }

  public resume: any = {
    emit(): void { },
    subscribe(): any { }
  };

  public pause: any = {
    emit(): void { },
    subscribe(): any { }
  };

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
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public push(): any {
    return new Promise(function (resolve: Function): void {
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
    return;
  }

  public unregisterChildNav(nav: any) {
    return;
  }

}

export class ViewControllerMock {

  public readReady: any = {
    emit(): void { },
    subscribe(): any { }
  };

  public writeReady: any = {
    emit(): void { },
    subscribe(): any { }
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

export class StripeMock {
  public setPublishableKey() {
    return new Promise((resolve, reject) => {
      resolve();
    })
  }
}

export class AlertProviderMock { }

export class PaymethodsProviderMock { }
export class ActivitiesProviderMock { }
export class SocialSharingMock { }
export class StripeProviderMock { }

export class AnalyticsProviderMock { 
  public logEvent(name: string, data: {}): Promise<any> {
    return Promise.resolve("");
  }
}

export class SlidesMock {
  public slideTo(): any {
    return 0;
  }
}

export class ShareProviderMock {
  public donate() {
    return new Promise((resolve, reject) => {
      resolve();
    })
  }
}

export class AuthProviderMock {
  public getAuthenticatedUser() {
    return new Promise((resolve, reject) => {
      resolve(true);
    })
  }
}

export class DataProviderMock {
  activity = null;
  donation = null;
  organization = null;
  public getActivitiesForOrg() {
    return new Promise((resolve, reject) => {
      resolve(this.activity);
    })
  }
  public getDonationRecords() {
    return Observable.of([]);

  }
  public getAllOrganizations() {
    return new Promise((resolve, reject) => {
      resolve(this.organization);
    })
  }
}

export class SocialShareProviderMock {
  public startSocialShare(organization?: shareTypes.Organization, activity?: shareTypes.Activity) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
}

export class UserProviderMock {
  currentUser: shareTypes.User = {
    profile: {
      name: {
        first: "firstName",
        last: "lastName",
        displayName: "first LastName"
      },
      email: "user@email.com",
      phoneNumber: "",
      provider: {
        id: "",
        token: ""
      }

    },
    info: {

      isDemo: false,
      isAdmin: false,
      isEnabled: true,
      notificationToken: "notificationToken",
      lastActiveTime: new Date()
    },
    organization: "",
    favorites: {
      activities: {},
      organizations: {}
    },
    paymethods: [],
    contactPrefs: {

      emailForLikes: true,
      emailForGeneral: false
    },
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      id: "userID",
      misc: null
    }
  };

  currentAuthUser = 'mockAuthUser';

  public getUserProfile() {
    return (this.currentUser.profile);
  };
  public getUserId() {
    return (this.currentUser.metadata.id);
  };
  public userHasOrganization() {
    return (this.currentUser.organization);
  };
  public isUserFavorite(type, id) {
    return (false);
  };

  public isRoleTester(): boolean {

    return false;
  }

  public isLoggedIn(): boolean {
    return true;
  }
  public userLikesOrganization(orgId: string): boolean {
    let result: boolean = false;
    if (this.currentUser && this.currentUser.favorites && this.currentUser.favorites.organizations &&
      this.currentUser.favorites.organizations.hasOwnProperty(orgId)) {
      result = true;
    }

    return result;
  };

  // set loginType to control isLoginPassword()
  public loginType: string = "password";
  public isLoginPassword(): boolean {
    return this.loginType === 'password' ? true : false;
    //return  !this.currentUser.profile.provider || !this.currentUser.profile.provider == 

  }

  public getEmail(): String {
    return this.currentUser ? this.currentUser.profile.email : "";
  }
}


export class NavParamsMock {
  activity: shareTypes.Activity = {
    "id": "mock",
    "organization": "orgAlive",
    "info": {
      "type": 'standard',
      "featured": false,
      "promoted": false,
      "displayOrder": 0,
      "shareuid": "ALIVE",
      "enabled": true
    },
    "images": {
      "image": null,
      "logo": null,
      "mainImage": null
    },
    "messages": {
      "headline": "mockHeadline",
      "mainMessage": "mockMessage",
      "callToAction": "mockCalToAction",
      "motd": null
    },
    "dates": {
      "startDate": new Date(),
      "endDate": new Date(),
      "activityDate": null,
      "activeDateStart": null,
      "activeDateEnd": null,
      "activeDateTimer": null
    },
    engagement: {
      showVolunteer: true,
      showInterested: true,
      showCommunicate: true,
      showPetition: true
    },
    "social": null,
    "parent": null,
    "children": null,
    "metadata": {
      createdAt: new Date(),
      updatedAt: new Date(),
      id: "idString",
      misc: null
    }
  }

  stripeaccountInfo: shareTypes.stripeAccountInfo = {
    "type": null,
    "stripeConnectToken": null,
    "stripeState": null,
    "account": null,
    "creditCardFee": 0
  }

  paypalaccountInfo: shareTypes.paypalAccountInfo = {
    type: "paypal",
    optInOut: true,
    status: 'connected', // 'pending', 'connected, '
    emailConfirmed: true,
    referralUrl: "",
    account: "",
    creditCardFee: 0.029
  }

  documentmetadata: shareTypes.documentMetadata = {
    createdAt: null,
    updatedAt: null,
    id: null
  }

  imagesizes: shareTypes.ImageSizes = {
    "full": null,
    "thumbnail": null,
    "reduced": null
  }


  organization: shareTypes.Organization = {
    "id": 'mockId',
    "companyName": 'mockcompanyName',
    "ein": 'mockein',
    "shareuid": 'mockshareuid',
    "images": {
      "image": 'mockimage',
      "mainImage": this.imagesizes,
      "logo": this.imagesizes
    },
    "messages": {
      "howHelp": {
        "whatHelps": "what helps string",
        "whatItDoes": "What it does string"
      },
      "whatWeAreDoing": "This is what we are doing",
      "getInvolved": "This is how to get involved"
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
      "enabled": true,
      "featured": true,
      "hidden": false,
      "march": false
    },
    "communications": {
      "email": "contactme@here.org"
    },
    "donationPrefs": [100],
    "account": { applicationFee: 0.29 },
    "additionalData": {},
    "metadata": this.documentmetadata
  };

  paymethodChoices: shareTypes.paymethodChoices[] =
    [
      {
        kind: 'stripe',
        iconType: 'icon',
        imgUrl: '',
        description: 'Add credit card',
        canHaveMany: true
      },
      {
        kind: 'paypal',
        iconType: 'image',
        imgUrl: './assets/img/ccIcons/paypal.png',
        description: 'Checkout with PayPal',
        canHaveMany: false
      }
    ];

  public get(key): any {
    switch (key) {
      case 'activity':
        return (this.activity);
      case 'organization':
        return (this.organization);
      case 'paymethodChoices':
        return (this.paymethodChoices);
    }
    return String(key) + 'Output';
  }
}

export class AngularFirestoreMock {
  b = 0;
  public collection() {
    return new Promise((resolve, reject) => {
      resolve(this.b)
    })
  }
}

export class OrganizationProviderMock {
  organizations = null;
  public getAllOrganizations() {
    return new Promise((resolve, reject) => {
      resolve(this.organizations)
    })
  }

  public getId(organization: shareTypes.Organization): string {
    return organization.metadata.id;
  }
}

export class ErrorReporterProviderMock {
  public log(message) {
    return;
  }
  public error(message) {
    return;
  }
}

export class NotificationsProviderMock {
  b = 0;
  public init() {
    return new Promise((resolve, reject) => {
      resolve(this.b)
    })
  }
}

export class DeviceMock {
  public device: string = "uniqueDeviceString";
}

export class InAppBrowserMock {
  public create(url: string, system: string, options: any) {
    return true;
  }
}

export class MarchProviderMock {

}

export class NativeStorageMock {
  public setItem(reference: string, value: any): void {
    return;
  }

  public getItem(reference: string): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve();
    })
  }
}

export class AppVersionMock {
  version = 20;
  name = 'mockedAppName';
  package = 'mockedAppPackage';
  code = 20;

  public getVersionNumber() {
    return new Promise((resolve, reject) => {
      resolve(this.version)
    })
  }
  public getAppName() {
    return new Promise((resolve, reject) => {
      resolve(this.name)
    })
  }
  public getPackageName() {
    return new Promise((resolve, reject) => {
      resolve(this.package)
    })
  }

  public getVersionCode() {
    return new Promise((resolve, reject) => {
      resolve(this.code)
    })
  }

}