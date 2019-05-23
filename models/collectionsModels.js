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

const Validator = require('jsonschema').Validator;
const entityModel = new Validator();

const entitySchema = {
    "id" : "/EntitySchema",
    "type" : "object",
    "properties": {
        "id" : {"type" : "string", "maxProperties": 1},
        "type": {"type" : "string", "maxProperties": 1},
        "location" : {"$ref" : "/GeoPropertySchema", "maxProperties": 1}, /*To define*/
        "observationSpace": {"$ref": "/GeoPropertySchema", "maxProperties": 1},
        "operationSpace": {"$ref" : "/GeoPropertySchema", "maxProperties": 1},
        "^[a-zA-Z]+$": {"$ref": "/PropertySchema"}, 
        "^[a-zA-Z]+$": {"$ref": "/RelationshipSchema"}, 
        "@context" : {"type": "array",  "items": {"type": "string", "format": "uri"}} 
    },
    "additionalProperties": false,
    "required" : ["id", "type"]
};

var propertySchema = {
    "id" : "/PropertySchema",
    "type" : "object",
    "properties" : {
        "type" : {"type": "string", "const": "Property", "maxProperties": 1},
        "value" : {"type" : "string", "maxProperties": 1}, /*json*/
        "observedAt" : {"type": "string" , "format": "date-time", "maxProperties": 1},
        "unitCode": {"type" : "string", "maxProperties": 1},
        "datasetId": {"type" : "string", "format": "uri", "maxProperties": 1}, 
        //"^[a-z]+$": {"$ref": "/PropertySchema"}, 
        //"^[a-z]+$": {"$ref": "/RelationshipSchema"}
    },
    "additionalProperties" : false, 
    "required" : ["type", "value"]
}; 

const relationshipSchema = {
    "id" : "/RelationshipSchema", 
    "type" : "object", 
    "properties": {
        "type" : {"type": "srting", "const": "Relationship", "maxProperties":1}, 
        "object": {"type": "string", "format": "uri", "maxProperties": 1},
        "observedAt" : {"type": "string" , "format": "date-time", "maxProperties": 1},
        "datasetId": {"type" : "string", "format": "uri", "maxProperties": 1}, 
        "^[a-z]+$": {"$ref": "/PropertySchema"}, 
        "^[a-z]+$": {"$ref": "/RelationshipSchema"}, 
    },
    "additionalProperties": false, 
    "required" : ["type", "object"]
}; 
const geoObject = {
    "id" : "/GeoObjectSchema", 
    "type" : "object", 
    "properties" : {
        "type" : {"type" : "string", "enum": ["Polygon", "Point", "LineString", "MultiPolygon", "MultiPoint", "MultiLineString"], "maxProperties":1}, 
        "coordinates" : {"type": "array", "maxProperties":1}
    },
    "additionalProperties" : false, 
    "required" : ["type", "value"]
};
const geoPropertySchema = {
    "id" : "/GeoPropertySchema", 
    "type" : "object", 
    "properties" : {
        "type" : {"type": "srting", "const": "GeoProperty", "maxProperties":1}, 
        "value" : {"$ref" : "/GeoObjectSchema", "maxProperties":1}, 
        "observedAt" : {"type": "string" , "format": "date-time", "maxProperties": 1},
        "datasetId": {"type" : "string", "format": "uri", "maxProperties": 1}, 
        "^[a-z]+$": {"$ref": "/PropertySchema"}, 
        "^[a-z]+$": {"$ref": "/RelationshipSchema"}
    },
    "additionalProperties": false, 
    "required" : ["type", "value"]
};

entityModel.addSchema(propertySchema, '/PropertySchema');
entityModel.addSchema(relationshipSchema, '/RelationshipSchema'); 
entityModel.addSchema(geoPropertySchema, '/GeoPropertySchema'); 


const csourceRegistrationSchema = {
    "id" : "/CsourceRegistrationSchema", 
    "type" : "object", 
    "properties" : {
        "id" : {"type" : "string", "format" : "uri", "maxProperties": 1,"description" : "not provided at creation time, it will assigned during registration process and returned to client. It can not be later modified in update operations."}, 
        "type" : {"type" : "string", "const" : "ContextSouceRegistration", "maxProperties": 1}, 
        "name" : {"type" : "string", "description" : "non-empty string", "maxProperties": 1}, 
        "desciption" : {"type" : "string", "description" : "non-empty string", "maxProperties": 1}, 
        "information" : {"$ref" : "/RegistrationInfoschema", "description" : "Empty array is not allowed", "maxProperties": 1}, 
        "observationInterval" : {"$ref" : "/TimeIntervalSchema", "maxProperties": 1, "description" : "it specifies the time interval for which the context source can provide entity information as specified by the observedAt Temporal property"},
        "managementInterval" : {"$ref" : "/TimeIntervalSchema", "maxProperties": 1, "description": "it specifies the time intarval for which the context source can provide entity information as specified by the createdAt and modifiedAt temporal properties"}, 
        "location" : {"$ref" : "/GeoPropertySchema", "maxProperties": 1}, 
        "observationSpace" : {"$ref" : "/GeoPropertySchema", "maxProperties": 1}, 
        "operationSpace" : {"$ref" : "/GeoPropertySchema", "maxProperties": 1}, 
        "expires" : {"type": "string", "format": "date-time", "maxProperties": 1}, 
        "endpoint" : {"type": "string", "format": "uri", "maxProperties": 1}, 
        "^[a-z]+$" : {"type": "object", "description": "a context property pertains to a characteristic of the context source, any JSON value"}, 
        "@context" : {"type" : "array", "description": "an array of uri", "maxProperties": 1}

    }, 
    "additionalProperties" : false, 
    "required" : ["type", "information", "endpoint"]
};

const registrationInfoschema = {
    "id" : "/RegistrationInfoSchema", 
    "type" : "object", 
    "properties" : {
        "entities" : {"$ref": "/EntityInfoschema", "description": "an array of EntiyInfo", "maxProperties": 1}, 
        "properties" : {"type" : "array", "description" : "an array of string", "maxProperties": 1}, 
        "relationships" : {"type": "array", "desciption": "an array of string", "maxProperties": 1}
    },
    "additonnalProperties" : false, 
    "required" : ["entities", "properties", "relationships"]
}; 

const timeIntervalSchema = {
    "id" : "/TimeIntervalSchema", 
    "type" : "object", 
    "properties" : {
        "start" : {"type": "string", "format" : "date-time", "maxProperties": 1}, 
        "end" : {"type": "string", "format": "date-time", "maxProperties" : 1}
    }, 
    "additionnalProperties" : false, 
    "required" : ["start"]
};

const entityInfoschema = {
    "id" : "/EntityInfoSchema", 
    "type" : "object", 
    "properties" : {
        "id" : {"type" : "string", "maxProperties" : 1}, 
        "idPattern" : {"type" : "string", "maxProperties" : 1, "description": "Regular expression that denotes a pattern that shall be matched by the provided or subscribed entities"}, 
        "type" : {"type" : "string", "maxProperties" : 1}
    }, 
    "additionalProperties" : false, 
    "required" : ["type"]
};

const subscriptionSchema = {
    "id" : "/SubscriptionSchema", 
    "type" : "object", 
    "properties" : {
        "id" : {"type":"string", "format": "uri", "description": "Generated at creation time", "maxProperties" : 1}, 
        "type" : {"type" : "string", "const": "Subscription", "maxProperties" : 1}, 
        "name" : {"type" : "string", "maxProperties" : 1, "description" : "short name given to this subscription"}, 
        "description" : {"type": "string", "maxProperties" : 1}, 
        "entities" : {"$ref": "/EntityInfoschema", "description": "an array of EntiyInfo. Entities subscribed", "maxProperties": 1}, 
        "watchedAttributes" : {"type" : "array", "maxProperties": 1, "description" : "Attribute Name as shorthand string. Empty array is not allowed. If time Interval is present, length equal to 0"},
        "timeInterval" : {"type" : "number", "maxProperties": 1, "description" : "greater than 0. If watchedAttributes appears should not appear. Indicates that a notification shall be delivered regardless of attribute change"},  
        "q" : {"type": "string", "maxProperties" : 1}, 
        "geoQ" : {"$ref" : "/GeoQuerySchema", "maxProperties" : 1}, 
        "csf" : {"type" : "string", "description" : "Context source filter that shall be met by Context Sources Registrations", "maxProperties" : 1},
        "isActive" : {"type" : "boolean", "default" : "true", "maxProperties" : 1}, 
        "notification" : {"$ref" : "/NotificationParamsSchema", "maxProperties" : 1}, 
        "expires" : {"type" : "string", "format" : "date-time", "maxProperties" : 1}, 
        "throttling" : {"type" : "number", "maxProperties" : 1, "description": "minimal time period in sec which shall elapse between two consective notifications. If timeInterval is present, must not appear"}, 
        "temporalQ" : {"$ref" : "/TemporalQuerySchema", "maxProperties" : 1, "description": "provided only in the context of Context registration subscriptions"},
        "status" : {"type" : "string", "enum" : ["active", "paused", "expired"], "maxProperties" : 1}
    }, 
    "additionnalProperties" : false, 
    "required" : ["type", "notification"]
};

const geoQuerySchema = {
    "id" : "/GeoQuerySchema", 
    "type" : "object", 
    "properties" : {
        "geometry" : {"type" : "string", "enum": ["Point", "MultiPoint", "LineString","MultiLineString","Polygon","MultiPolygon"], "maxProperties" : 1}, 
        "coordinates" : {"type" : "array", "maxProperties" : 1, "description": "type could be a string"}, 
        "georel" : {"type" : "string", "enum": ["equals", "disjoint", "intersects", "within", "contains", "overlaps"], "description" : "when near relation is consididered, we should follow this pattern '^near;((maxDistance==\d+)|(minDistance==\d+))$'","maxProperties" : 1}, 
        "geoProperty" : {"type" : "string", "maxProperties" : 1, "description":"specifies the GoeProperty to which the GeoQuery is to be applied", "default" : "location"}
    }, 
    "additionnalProperties" : false, 
    "required" : ["geometry", "coordintes", "georel"]
}; 

const notificationParamsSchema = {
    "id" : "/NotificationParamsSchema", 
    "type" : "object", 
    "properties" : {
        "attributes" : {"type": "array", "maxProperties" : 1, "description" : "Entity Attributes Names to be included in the notification payload"},
        "format" : {"type" : "string", "maxProperties" : 1, "enum": ["KeyValues", "Normalized"]}, 
        "endpoint" : {"$ref": "/EndpointSchema", "maxProperties" : 1}, 
        "status" : {"type": "string", "enum" : ["ok", "failed"], "maxProperties" : 1}, 
        "timesSent" : {"type" : "number", "maxProperties" : 1}, 
        "lastNotification" : {"type" : "string", "format": "date-time","maxProperties" : 1, "description" : "system Generated, not to be checked"}, 
        "lastFailure" :  {"type" : "string", "format": "date-time", "maxProperties" : 1, "description" : "system Generated, not to be checked"},
        "lastSuccess" : {"type" : "string", "format": "date-time", "maxProperties" : 1, "description" : "system Generated, not to be checked"}
    }, 
    "additionnalPropreties" : false, 
    "required" : ["endpoint"]
}; 

const endpointSchema = {
    "id" : "/EndpointSchema", 
    "type" : "object", 
    "properties" : {
        "uri" : {"type" : "string", "format" : "uri", "maxProperties" : 1},
        "accept": {"type": "string", "enum": ["application/json", "application/ld+json"], "maxProperties":1}
    }, 
    "additionnalProperties" : false, 
    "required" : ["uri"]
}; 

const temporalQuerySchema = {
    "id" : "/TemporalQuerySchema", 
    "type" : "object", 
    "properties" : {
        "timerel" : {"type" : "string", "enum" : ["before", "after", "between"], "maxProperties" : 1}, 
        "time" : {"type": "string", "format": "date-time", "maxProperties" : 1}, 
        "endTime" : {"type": "string", "format": "date-time", "maxProperties": 1, "description": "cardinality should be 1 is timerel is equal to between"}, 
        "timeproperty" : {"type": "string", "default": "observedAt", "maxProperties": 1}
    }, 
    "additionnalProperties" : false, 
    "required" : ["timerel", "time"]
}; 

