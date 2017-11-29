export const testStripeAcct = {"id" : "acct_1Ai6pMHMFCaEtegi"};
export const orgSeeds = [
    {
        "key":  "orgHumane",
        "data": {
            "companyName": "Naperville Area Humane Society",
            "ein": "36-3040480",
            "shareuid": "NAHS17",
            "images": {
                "image": "https://firebasestorage.googleapis.com/v0/b/share-75e74.appspot.com/o/seed%2Fpuppy.png?alt=media&token=4c84e2fc-57d7-43b5-bef5-1d23672af00c",
                "logo": "https://firebasestorage.googleapis.com/v0/b/share-75e74.appspot.com/o/seed%2Fkitten%20logo.png?alt=media&token=8f21c777-89f8-4b71-9666-a0d3ed7de37b"
            },
            "social": {
                "message": null,
                "hashTags": null,
                "subject": null
            },
            "info": {
                "coreMessage": "We are helping animals",
                "isDemo": null,
                "description": "Helping pets in your neighborhood",
                "enabled": true
            },
            "uxPreferences" : {
                "titleFont" : "black"
              },
            "donationPrefs": [
                5,
                10,
                20,
                50,
                75
            ],
            "payMethods": [
                {
                "type": "stripe",
                "data": {
                    "creditCardFee": 0.029
                    }
                },
            ],
            "subscription": {
                "applicationFee" : 0.0
            }
        }
    },
    {
        "key":  "orgChadTough",
        "data": {
            "companyName": "Chad Tough",
            "ein": "47-4041494",
            "shareuid": "CHADTGH",
            "images": {
                "image": "https://firebasestorage.googleapis.com/v0/b/share-75e74.appspot.com/o/seed%2Ftommy_ruddy-640x400.jpg?alt=media&token=fd4e10cf-d743-48cb-b5ca-125553afa1bc",
                "logo": "https://firebasestorage.googleapis.com/v0/b/share-75e74.appspot.com/o/seed%2FChadToughLogo.png?alt=media&token=95eb3d37-0683-46ec-b57b-305868c621a3"
            },
            "social": {
                "message": "I support Chad Tough's fight against pediatric cancer",
                "hashTags": "#chadTough",
                "subject": "Chad Tough"
            },
            "info": {
                "coreMessage": "The Chad Tough Foundation, founded by the Lloyd Carr family, supports pediatric brain tumor research and studies nationwide.",
                "description": "Attack pediatric brain cancer",
                "isDemo": false,
                "enabled": true,
                "backgroundColor" : "rgba(255, 117, 0, 1)"
            },
            "featuredActivity" : {
                "shortMessage" : "Promoting the current activity"
            },
            "uxPreferences" : {
              "titleFont" : "white"
            },
            "donationPrefs": [
                10,
                25,
                50,
                100,
                500
            ],
            "paymethods": [
                {
                  "type" : "stripe",
                   "creditCardFee": 0.029
                }
            ],
            "subscription":
                {
                    "applicationFee" : 0.0
                }
        }
    },
    {
        "key":  "orgDesireStreet",
        "data": {
            "companyName": "Desire Street Ministries",
            "ein": "72-1218825",
            "shareuid": "DESIREST",
            "images": {
                "image": "https://firebasestorage.googleapis.com/v0/b/share-75e74.appspot.com/o/seed%2FJumping-Off-Point-by-Will-van-Wingerden1-720x220.jpg?alt=media&token=eb62910c-c1cc-47ca-aa6e-04f41f876491",
                "logo": "https://firebasestorage.googleapis.com/v0/b/share-75e74.appspot.com/o/seed%2FdesireStLogo.png?alt=media&token=8eb16fc0-c88a-4b6f-9e43-f99407ebb8c1"
            },
            "social": {
                "message": "I support Desire Street Ministries efforts to help people two steps at a time",
                "hashTags": "#DesireStreetMinistries",
                "subject": "Desire Street Ministries"
            },
            "featuredActivity" : {
                "shortMessage" : "Promoting the current activity"
            },
            "info": {
                "coreMessage": "Transforming impoverished urban neighborhoods into flourishing, healthy communities is our goal, and Desire Street believes that bolstering the leaders in those neighborhoods is the best route toward that goal",
                "description": "Transforming neighborhoods two steps at a time",
                "isDemo": false,
                "enabled": true,
                "backgroundColor" : "#E3831E"
            },
            "donationPrefs": [
                10,
                25,
                50,
                100,
                500
            ],
            "uxPreferences" : {
                "titleFont" : "black"
              },
            "payMethods": [
                {
                "type": "stripe",
                "data": {
                    "creditCardFee": 0.029
                    }
                },
            ],
            "subscription": {
                "applicationFee" : 0.0
            }
        }
    }
]