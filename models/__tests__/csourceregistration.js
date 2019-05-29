var csourceregistration = require('../csourceregistrationModel'); 

describe('csourceRegistration resource validation', function(){
    test('Valid csourceRegistration', function(){
        const validCSRegistration= {
            "id": "urn:ngsi-ld:ContextSourceRegistration:csr1a3456",
            "type": "ContextSourceRegistration",
            "information": [
              {
                "entities": [
                  {
                    "id": "urn:ngsi-ld:Vehicle:A456",
                    "type": "Vehicle"
                  }
                ],
                "properties": [
                  "brandName",
                  "speed"
                ],
                "relationships": [
                  "isParked"
                ]
              },
              {
                "entities": [
                  {
                    "idPattern": ".*downtown$",
                    "type": "OffStreetParking"
                  },
                  {
                    "idPattern": ".*47$",
                    "type": "OffStreetParking"
                  }
                ],
                "properties": [
                  "availableSotNumber",
                  "totalSpotNumber"
                ],
                "relationships": [
                  "isNextToBuilding"
                ]
              }
            ],
            "endpoint": "http://my.csource.org:1026",
            "location": {
              "type": "GeoProperty",
              "value": {
                  "type": "Polygon",
                  "coordinates": [
                  [
                      [
                      100.0,
                      0.0
                      ],
                      [
                      101.0,
                      0.0
                      ],
                      [
                      101.0,
                      1.0
                      ],
                      [
                      100.0,
                      1.0
                      ],
                      [
                      100.0,
                      0.0
                      ]
                  ]
                  ]
              }
            },
            "@context": [
              "http://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
              "http://example.org/ngsi-ld/commonTerms.jsonld",
              "http://example.org/ngsi-ld/vehicle.jsonld",
              "http://example.org/ngsi-ld/parking.jsonld"
            ]
        }; 
        expect(csourceregistration.csourceRegistrationValidator(validCSRegistration).correct).toBe(true); 
    }); 

    test('Not valid csourceregistration', function(){
        const notValidCSRegistration = {
            "id": "urn:ngsi-ld:ContextSourceRegistration:csra350",
            "type": "ContextSourceRegistration",
            "information": [
                {
                    "entities": [
                    {
                        "id": "urn:ngsi-ld:Vehicle:A456",
                        "type": "Vehicle"
                    }
                    ],
                    "properties": [
                        "brandName",
                        "speed"
                    ]
                }
            ], 
            "endpoint" : "http://my.csource.org:2202"   
        }; 
        expect(csourceregistration.csourceRegistrationValidator(notValidCSRegistration).correct).toBe(false); 
    }); 
})