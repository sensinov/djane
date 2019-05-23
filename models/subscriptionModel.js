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

var entityInfo = require('./csourceregistrationModel'); 
var isUri = require('isuri');

function checkEntities(entities, result) {
    for (let i=0; i<entities.length; i++) {
        entityInfo.checkEntityInfo(entities[i], i, result); 
    }
}

function checkGeoQuery(geoQuery, result) {

    /*
        enumeration regrouping allowed values for geometry attribute.  
    */
    const geometry = [
        'Point', 
        'MultiPoint',
        'LineString',
        'MultiLineString', 
        'Polygon',
        'MultiPolygon'
    ];

    /*
        enumeration regrouping allowed values for georel attribute. 
    */
    const georel = [
        'equals', 
        'disjoint',
        'intersects', 
        'within', 
        'contains', 
        'overlaps'
    ]; 
    const geoRelRegex = RegExp('^near;((maxDistance==[0-9]+)|(minDistance==[0-9]+))$');

    /*
        Checking mandatory attributes: geometry, coordintes and georel.
    */

    if (geoQuery.geometry == null) {
        result.correct = false; 
        result.errorMsg = "geoQuery geometry attribute is missing. It is a mandatory attribute.";
    } else if (geoQuery.coordinates == null) {
        result.correct = false; 
        result.errorMsg = "geoQuery coordinates attribute is missing. It is a mandatory attribute.";
    } else if (geoQuery.georel == null) {
        result.correct = false; 
        result.errorMsg = "geoQuery georel attribute is missing. It is a mandatory attribute.";
    } else {
        /*
            Checking of geoQuery attributes data types
        */
        for (let attributename in geoQuery) {
            if (attributename == 'geometry') {  
                if (typeof(geoQuery[attributename]) !== 'string') {
                    result.correct = false; 
                    result.errorMsg = "geQuery geometry attribute type should be string."; 
                    break; 

                } else if (!geometry.includes(geoQuery[attributename])) {
                    result.correct = false; 
                    result.errorMsg = "Incorrect value. Allowed values are: Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon.";
                    break; 
                } 
            } else if (attributename == 'coordinates'){
                if (!(Array.isArray(geoQuery[attributename]))){
                    result.correct = false; 
                    result.errorMsg = "geoQuery coordinates attribute type should be array."; 
                    break; 
                }
            } else if (attributename == 'georel') {
                if (typeof(geoQuery[attributename]) !== 'string') {
                    result.correct = false; 
                    result.errorMsg = "geQuery georel attribute type should be string."; 
                    break; 
                } else if ((!georel.includes(geoQuery[attributename])) && (!(geoRelRegex.test(geoQuery[attributename])))) {
                    result.correct = false; 
                    result.errorMsg = "Incorrect value of georel attribute."; 
                    break; 
                }
            } else if (attributename == 'geoProperty') {
                if (typeof(geoQuery[attributename]) !== 'string') {
                    result.correct = false; 
                    result.errorMsg = "geQuery geoProperty attribute type should be string."; 
                    break; 
                } 
            }
        }
    }
}

function checkNotificationsParams (notification, result) {  
    /*
        enumeration regrouping allowed values for notification format attribute
    */
    const format = [
        'keyValues',
        'normalized'
    ]; 

    /*
        enumeration regrouping allowed values for notification status attribute
    */
    const status = [
        'ok', 
        'failed'
    ]; 
     
    /*
        Checking mandatory attributes: endpoint
    */

    if (notification.endpoint == null) {
        result.correct= false; 
        result.errorMsg="notification endpoint attribute is missing. It is a mandatory attribute."; 
    } else {
        /*
            Checking notification attributes data types. 
        */
        for (let attributename in notification) {
            if (attributename == 'attributes') {
                if (!(Array.isArray(notification[attributename]))) {
                    result.correct=false; 
                    result.errorMsg="notification attributes type should be array."; 
                    break; 
                }
            } else if (attributename == 'format'){
                if (typeof(notification[attributename]) !== 'string') {
                    result.correct=false; 
                    result.errorMsg="notification format type should be string."; 
                    break; 
                } else if (!format.includes(notification[attributename])) {
                    result.correct = false; 
                    result.errorMsg = "Wrong value of format attribute. Allowed values are: keyValues and normalized."; 
                    break; 
                }
            } else if (attributename == 'endpoint') {
                checkEndpoint(notification[attributename], result); 
            } else if (attributename = 'status') {
                if (typeof(notification[attributename]) !== 'string') {
                    result.correct=false; 
                    result.errorMsg="notification status type should be string."; 
                    break; 
                } else if (!status.includes(notification[attributename])) {
                    result.correct = false; 
                    result.errorMsg = "Wrong value of status attribute. Allowed values are: ok and failed."; 
                    break; 
                }
            }
        }
    }
}

/*
    function to validate a notification endpoint 
    input : 
        -- endpoint: json object representating a notification endpoint
        -- result: object containing the verdict subscription resource checking (can be modified) 
*/
function checkEndpoint(endpoint, result) {
    /*
        enumeration regrouping possible values of accept attribute
    */
    const accept = [
        'application/json', 
        'application/ld+json'
    ]; 

    /*
        Checking mandatory attributes : uri
    */
    if (endpoint.uri == null) {
        result.correct= false; 
        result.errorMsg= "endpoint uri attribute is missing."; 
    } else {
        /*
            Checking endpoint attributes data types
        */
        for (let attributename in endpoint) {
            if (attributename == 'uri') {
               if (!(isUri.isValid(endpoint[attributename]))) {
                    result.correct=false; 
                    result.errorMsg="Malformed uri for endpoint uri attribute value."; 
                    break; 
               }
            } else if (attributename == 'accept') {
                if (!accept.includes(endpoint[attributename])) {
                    result.correct=false; 
                    result.errorMsg="Wrong value of endpoint accept attribute. Allowed values are: 'application/json' and 'application/ld+json'"; 
                    break; 
                }
            }
        }
    }
}

/*
    function to validate a TemporalQ attribute
    input: 
        -- temporalQuery: a json representation a temporalQ attribute of a subscription resource
        -- result: an object Malformed uri for contextSourceRegistration attribute value.  
*/

function checkTemporalQuery(temporalQuery, result) {
    /*
        enumeration regrouping possible values of timerel atttibute
    */
    const timerel = [
        'before', 
        'between', 
        'after'
    ]; 

    let date = null; 
    /*
        checking mandatory attributes: timerel, time
    */
    if (temporalQuery.timerel == null) {
        result.correct = false; 
        result.errorMsg = "timerel attribute is missing. It is a mandatory attribute.";
    } else if (temporalQuery.time == null) {
        result.correct = false; 
        result.errorMsg = "time attribute is missing. It is a mandatory attribute.";
    } else {
        /*
            Checking TemporalQuery attributes data types
        */
        for (let attributename in temporalQuery) {
            if (attributename == 'timerel') {
                if (!timerel.includes(temporalQuery[attributename])) {
                    result.correct=false; 
                    result.errorMsg="Wrong value of timerel attribute. Allowed values are: bofore, after or between."; 
                    break; 
                }
            } else if (attributename == 'time') {
                date= new Date(temporalQuery[attributename]); 
                if (isNaN(Date.parse(date))) {
                    result.correct=false; 
                    result.errorMsg="time attribute is badly typed. Required type is Date.";
                    break;  
                }
            } else if (attributename == 'endTime') { 
                date= new Date(temporalQuery[attributename]); 
                if (isNaN(Date.parse(date))) {
                    result.correct=false; 
                    result.errorMsg="endTime attribute is badly typed. Required type is Date.";
                    break;  
                }
            } else if (attributename == 'timeproperty') {
                if (typeof(temporalQuery[attributename]) !== 'string') {
                    result.correct=false; 
                    result.errorMsg="timeproperty attribute is badly typed. Required type is string.";
                    break;   
                }
            }
        }
    }
}

/*
    function to validate a subscriptionSchema
    input : the request Body
    output : object containing a bool and error message (in the case of no valid imput) namely result
*/

function subscriptionValidator (reqBody) {
    var result = {
        correct : true, 
        errorMsg : ""
    }; 
    let watchedType = true; 
    let date = null; 

     /*
        enumeration regrouping allowed values for status attribute.  
    */
    const status = [
        'active', 
        'paused', 
        'expired'
    ]; 
    
    /*
        Checking mandatory attributes : type, notification 
    */
    if (reqBody.type == null) {
        result.correct = false; 
        result.errorMsg = "Subscription type is missing. It is a mandatory attribute."
    } else if (reqBody.notification == null) {
        result.correct = false; 
        result.errorMsg = "Subscription notification is missing. It is a mandatory attribute."
    } else {
        /*
            Checking of subscription attributes data types
        */
        for (let attributename in reqBody) {
            console.log ("checking of "+attributename+" attribute of a subscription resource instance"); 
            if (attributename == 'type') {
                if (typeof(reqBody[attributename]) !== 'string') {
                    result.correct=false; 
                    result.errorMsg="Subsription type attribute type should be string."; 
                    break; 

                } else if (reqBody[attributename] !== 'Subscription') {
                    result.correct = false; 
                    result.errorMsg= "Subscription type value should be equal to 'Subscription'.";
                    break;   
                }
            } else if (attributename == 'name') {
                if (typeof(reqBody[attributename])!== 'string') {
                    result.correct = false; 
                    result.errorMsg = "Subscription name attribute type should be string."; 
                    break; 
                }
            } else if (attributename == 'description') {
                if (typeof(reqBody[attributename]) !== 'string') {
                    result.correct = false; 
                    result.errorMsg = "Subscription description attribute type should be string."; 
                    break; 
                }
            } else if (attributename == 'entities') {
                checkEntities(reqBody[attributename], result); 
            } else if (attributename == 'watchedAttributes') {
                if (!(Array.isArray(reqBody[attributename]))) {
                    result.correct = false; 
                    result.errorMsg = "Subscription watchedAttributes attribute type should be an array."; 
                    break; 
                } else {
                    for (let i=0; i < reqBody[attributename].length; i++){
                        if (typeof((reqBody[attributename])[i]) !== 'string') {
                            watchedType= false; 
                            break; 
                        }
                    }
                    if (watchedType == 'false') {
                        result.correct = false;  
                        result.errorMsg = "entities attribute elements must be of type string"; 
                        break; 
                    }
                }
            } else if (attributename == 'timeInterval') {
                if (typeof(req[attributename]) !== 'number') {
                    result.correct = false; 
                    result.errorMsg = "Subscription timeInterval attribute type should be number.";
                    break; 
                }
            } else if (attributename == 'q') {
                if (typeof(reqBody[attributename]) !== 'string') {
                    result.correct = false; 
                    result.errorMsg = "Subscription q attribute type should be string.";
                    break; 
                }
            } else if (attributename == 'geoQ') {
                checkGeoQuery(reqBody[attributename], result); 
            } else if (attributename == 'csf') {
                if (typeof(reqBody[attributename]) !== 'string') {
                    result.correct = false; 
                    result.errorMsg = "Subscription geoQ attribute type should be string."; 
                    break; 
                }
            } else if (attributename == 'isActive') {
                if (typeof(reqBody[attributename]) !== 'boolean') {
                    result.correct = false; 
                    result.errorMsg= "Subscription isActive attribute type should be boolean."; 
                    break; 
                }
            } else if (attributename == 'notification') {
                checkNotificationsParams (reqBody[attributename], result); 
            } else if (attributename == 'expires') {
                date = new Date(reqBody[attributename]); 
                if (isNaN(Date.parse(date))) {
                    result.errorMsg = "Subscription expires attribute of is badly typed. Required data type is Date."; 
                    result.correct = false; 
                    break; 
                }        
            } else if (attributename == 'throttling') {
                if (typeof(reqBody[attributename]) !== 'number') {
                    result.correct = false; 
                    result.errorMsg = "Subscription throttling attribute type should be number."; 
                    break; 
                }
            } else if (attributename == 'temporalQ') {
                checkTemporalQuery(reqBody[attributename], result); 
            } else if (attributename == 'status') {
                if (typeof (reqBody[attributename]) !== 'string') {
                    result.correct = false; 
                    result.errorMsg = "Subscription status attribute type should be string."; 
                    break; 
                } else if (!status.includes(reqBody[attributename])) {
                    result.correct = false; 
                    result.errorMsg = "Wrong value of subscription status attribute. Possible values are : active, paused and expired."; 
                    break; 
                } 
            } else if (attributename == '@context') {
                if (!(Array.isArray(reqBody[attributename]))) {
                    result.errorMsg = "@context is badly typed. Should be an array of uris"; 
                    result.correct = false; 
                    break; 
                }
            }
            console.log("correct = " + result.correct);  
        }
    }

    return result; 

}

module.exports={subscriptionValidator}; 
