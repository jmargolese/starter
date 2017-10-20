export const userDataSeeds = [
    {
        key: "fred.ipmw+20@gmail.com",
        data: {
            "profile": {
                "name": {
                    "first": "Fred",
                    "last": "Flint20"
                },
                "phoneNumber": "555 555-1212"
            },
            "info": {
                "isDemo": false,
                "isAdmin": false,
                "isEnabled": true
            },
            "organization": "orgChadTough",
            "paymethods": [
                {
                    vendor: "stripe",
                    isPreferred: true,
                    kind: "card",
                    displayName: "Visa ending in 1234",
                    brand: "Visa",
                    hidden: false

                },
                {
                    vendor: "stripe",
                    isPreferred: false,
                    kind: "card",
                    displayName: "MC ending in 6663",
                    brand: "MC",
                    hidden: false

                },

            ]
        }
    },
    {
        key: "102",
        data: {
            "profile": {
                "name": {
                    "first": "Rocky",
                    "last": "Balboa"
                },
                "phoneNumber": "555 555-1212"
            },
            "info": {
                "isDemo": false,
                "isAdmin": false,
                "isEnabled": true
            },
            "organization": "orgChadTough"
        }
    },
    {
        key: "103",
        data: {
            "profile": {
                "name": {
                    "first": "Apollo",
                    "last": "Cread"
                },
                "phoneNumber": "555 555-1212"
            },
            "info": {
                "isDemo": false,
                "isAdmin": false,
                "isEnabled": true
            },
            "organization": "orgDesireSt"
        }
    }
]