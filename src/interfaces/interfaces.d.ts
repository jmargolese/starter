/* export interface PayMethod {
  vendor: string,
  isPreferred: boolean,
  kind: string,
  displayName: string,
  brand: string,
  hidden: boolean,
  sourceId: string
}

export interface StripeToken {
  userId: string,
  token: {}
}

export interface UserProfile {

  "name": {
    "first": string,
    "last": string
  },
  "email" : string,
  "phoneNumber": string

}

export interface UserInfo {

    "isDemo": boolean,
    "isAdmin": boolean,
    "isEnabled": boolean,
    "notificationToken" ?: string
}

export interface UserContactPrefs {
  
    emailForLikes: boolean,
    emailForGeneral: boolean
}
export interface User {

  "uid" : string,             // not stored, retrieved from DB
  "profile": UserProfile,
  "info": UserInfo,
  "organization": string,
  "favorites" : {
    "activities" : {},
    "organizations" : {}
  }
  "paymethods": PayMethod[],

  "contactPrefs" : UserContactPrefs

}

export interface PayMethodInfoStripe {
      "hasStripeAccount": true,
      "creditCardFee": 0.029
}

export interface Organization {
  "id" : string,         // db reference not stored in the object
  "companyName": string,
  "ein": string,
  "shareuid":  string,
  "images": {
      "image": string,
      "logo": string,
  },
  "social": {
      "message": string,
      "hashTags": string,
      "subject": string,
  },
  "info": {
      "coreMessage": string,
      "isDemo": boolean,
      "description": string,
      "enabled": boolean
  },
  "donationPrefs": number[],
  "paymentAccounts": [
      {
          "type" : string,
          "data": any
      }
  ]
  "account": {
    "applicationFee": number
  }
}

export enum authEventTypes {
    login = "login",
    logout = "logout",
    changed = "changed"
    }
 */