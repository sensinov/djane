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

var entity = require('../entityModel'); 

describe ('Entity resource validation', function () {
    test('Valid entity', function() {
        const validEntity = {
            "id": "urn:ngsi-ld:Vehicle:A320",
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
        }; 
        expect(entity.entityValidator(validEntity).correct).toBe(true);
    }); 
    test('Not valid Entity', function(){
        const notValidEntity = {
            "id" : "urn:ngsi-ld:Vehicle:A380",
            "type" : "Vehicle", 
            "speed" : {
                "type" : "Property", 
                "value" : "22", 
                "providedBy": {
                    "object": "urn:ngsi-ld:Person:Sarah"
                }
            } 
        }; 
        expect(entity.entityValidator(notValidEntity).correct).toBe(false);
    }); 
}); 