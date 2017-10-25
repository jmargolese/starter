export interface PayMethod {

  vendor: string,
  isPreferred: boolean,
  kind: string,
  displayName: string,
  brand: string,
  hidden: boolean,
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
    "isEnabled": boolean
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
  "payMethods": [
      {
          "type" : string,
          "data": any
      }
  ]
}
