/*******************************************************************************
 * Copyright (c) 2019 sensinov (www.sensinov.com)
 * 41 Rue de la découverte, 31676 Labège, France
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *
 * Contributors:
 *     Mahdi Ben Alaya (Project co-founder) - Management and initial specification,
 *         design, implementation, test and documentation.
 *     Ghada Gharbi (Project co-founder) - Management and initial specification,
 *         design, implementation, test and documentation.
 * Authors: 
 * 		Ghada Gharbi < ghada.gharbi@sensinov.com >
 ******************************************************************************/

var subscription = require ('../subscriptionModel'); 

describe ('Subscription resource validation', function(){
    test('Valid subscription', function(){
        const validSub = {
            "id": "urn:ngsi-ld:Subscription:S300",
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
        expect(subscription.subscriptionValidator(validSub).correct).toBe(true);
    }); 
    test ('Not valid subscription', function(){
        const notValidSub = {
            "id" : "urn:ngsi-ld:Subscription:S220", 
            "notification" : {
                "endpoint" : "http://my.endpoint.org/context"
            }
        }
        expect(subscription.subscriptionValidator(notValidSub).correct).toBe(false);
    }); 
})