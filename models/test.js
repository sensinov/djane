/*******************************************************************************
 * Copyright (c) 2019 sensinov (www.sensinov.com)
 * 41 Rue de la découverte, 31676 Labège, France
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Mahdi Ben Alaya (Project co-founder) - Management and initial specification,
 *         design, implementation, test and documentation.
 *     Ghada Gharbi (Project co-founder) - Management and initial specification,
 *         design, implementation, test and documentation.
 * Authors: 
 * 		Ghada Gharbi < ghada.gharbi@sensinov.com >
 ******************************************************************************/

var validator = require('./entityModel'); 
let csRegistrationValidator = require('./csourceregistrationModel') ; 
let subscriptionValidator = require('./subscriptionModel');
/*
const entityExample = {
    "id": "urn:ngsi-ld:Vehicle:A4567",
    "type": "Vehicle",
    "brandName": {
        "type": "Property",
        "value": "Mercedes", 
        "providedBy": {
            "type": "Relationship",
            "object": "urn:ngsi-ld:Person:Ana", 
            "observedAt" : "2018-08-01T12:05:00Z"
        }
    }, 
    "isParked": {
        "type": "Relationship",
        "object": "urn:ngsi-ld:OffStreetParking:Downtown1",
        "observedAt": "2018-08-01T12:05:00Z",
        "providedBy": {
            "type": "Relationship",
            "object": "urn:ngsi-ld:Person:Bob"
        }, 
        "brandName": {
            "type": "Property",
            "value": "Mercedes"
        }
    },
    "observationSpace": {
        "type": "GeoProperty",
        "value": {
          "type":"LineString",
          "coordinates": [ -8 , 44 ]  
        }
    } ,  
    "@context": [
        "http://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
        "http://example.org/ngsi-ld/commonTerms.jsonld",
        "http://example.org/ngsi-ld/vehicle.jsonld",
        "http://example.org/ngsi-ld/parking.jsonld"
    ] 
}

for(var attributename in entityExample){
    console.log(attributename+": "+entityExample[attributename]);
}

var verdict=validator.entityValidator(entityExample); */

/*const csourceRegistrationExample = {
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
}
for(var attributename in csourceRegistrationExample){
    console.log(attributename+": "+csourceRegistrationExample[attributename]);
}

var verdict=csRegistrationValidator.csourceRegistrationValidator(csourceRegistrationExample);
*/

const subscriptionExample = {
  "id": "urn:ngsi-ld:Subscription:mySubscription",
  "type": "Subscription",
  "entities": [
    {
      "type": "Vehicle"
    }
  ],
  "watchedAttributes": [
    "speed"
  ],
  "q": "speed>50",
  "geoQ": {
    "georel": "near;maxDistance==2000",
    "geometry": "Point",
    "coordinates": [
      -1,
      100
    ]
  },
  "notification": {
    "attributes": [
      "speed"
    ],
    "format": "keyValues",
    "endpoint": {
      "uri": "http://my.endpoint.org/notify",
      "accept": "application/json"
    }
  },
  "@context": [
    "http://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
    "http://example.org/ngsi-ld/vehicle.jsonld"
  ]
}; 


for(var attributename in subscriptionExample){
  console.log(attributename+": "+subscriptionExample[attributename]);
}

var verdict=subscriptionValidator.subscriptionValidator(subscriptionExample); 

if(verdict.correct){
    console.log("subscription format is correct");
}else{
    console.log(verdict.errorMsg);
} 