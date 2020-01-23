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

var isUri = require('isuri');

function checkGeoPropertyValue(geoPropertyValue, propertyName,  result) {
     /*
        enumeration regrouping allowed values for geoProperty type attribute.  
    */
    const geoProperty = [
        'Polygon', 
        'Point', 
        'LineString', 
        'MultiPolygon', 
        'MultiPoint', 
        'MultiLineString'
    ]; 

    if (geoPropertyValue.type == null) {
        result.errorMsg = "Property type of " + propertyName + "is missing"; 
        result.correct = false ; 
    } else if (geoPropertyValue.coordinates == null) {
        result.errorMsg = "Property coordinates of " + propertyName + "is missing" ; 
        result.correct = false; 
    } else {
        for (let attributename in geoPropertyValue) {
            if (attributename == 'type') {
                if (typeof(geoPropertyValue[attributename]) !== 'string') {
                    result.correct = false; 
                    result.errorMsg = "Type attribute of " + propertyName + "is badly typed. Required type is string"; 
                    break; 
                } else if (!geoProperty.includes(geoPropertyValue[attributename])){
                    result.correct = false; 
                    result.errorMsg = "Type value of "+ propertyName + "is incorrect. Allowed values are : Polygon, Point, LineString, MultiPoint, MultiPolygon, MultiLineString"; 
                    break; 
                }
            } else if (attributename == 'coordinates') {
                if (!(Array.isArray(geoPropertyValue[attributename]))) {
                    result.correct = false; 
                    result.errorMsg = "Value attribute of " + propertyName + "is badly typed. Required type is array"; 
                    break; 
                }
            }
        }
    }
}

function checkGeoProperty (geoProperty, propertyName, result) {
    let date = null; 
    if (geoProperty.type == null) {
        result.errorMsg = "Proprety type of "+ propertyName +" is missing"; 
        result.correct = false ;
    } else if (geoProperty.value == null) {
        result.errorMsg = "Property value type of "+ propertyName +" is missing"; 
        result.correct = false; 
    } else {
        /*
            checking optional attributes : observedAt, unitCode, datasetId, property (ies), relationship(s)
        */
        for (let attributename in geoProperty) {
            if (attributename == 'type') {
                if (geoProperty[attributename] !== 'GeoProperty') {
                    result.errorMsg = "GeoProperty type of " + propertyName + " should be equal to 'GeoProperty'";
                    result.correct = false; 
                    break; 
                }
            } else if (attributename == 'observedAt'){
                    date= new Date(geoProperty[attributename]);  
                    if (isNaN(Date.parse(date))) {
                        result.errorMsg = "observedAt attribute of " + propretyName + " is badly typed. Required type is Date."; 
                        result.correct = false; 
                        break; 
                    } 
            } else if (attributename == 'datasetId') {
                    if ((typeof(geoProperty[attributename]) !== 'string')) {
                        result.errorMsg = "datasetId attribute of " + propertyName + " is badly typed. Required type is string, format uri"; 
                        result.correct = false; 
                        break;
                    } else if (!(isUri.isValid(geoProperty[attributename]))) {
                        result.errorMsg= "Malformed uri for datasetId attribute value of " + propertyName; 
                        result.correct = false; 
                        break; 
                    }
            } else if (attributename == 'value'){
                    checkGeoPropertyValue(geoProperty[attributename], propertyName, result); 
            } else if ((geoProperty[attributename].type == 'Property') || (geoProperty[attributename].hasOwnProperty('value'))){
                    checkProperty(geoProperty[attributename], attributename, result); 
            } else if ((geoProperty[attributename].type == 'Relationship') || (geoProperty[attributename].hasOwnProperty('object'))) {
                    checkRelationship(geoProperty[attributename], attributename, result) ; 
            }
             
        }
    }
    console.log (propertyName + " bool is equal to: " + result.correct); 

}

function checkRelationship (relationship, relationshipName, result) {
   /*
        Checking mandatory attributes 
   */ 
    let date = null; 
   if (relationship.type == null) {
        result.errorMsg = "Relationship type is missing"; 
        result.correct = false; 
   } else if (relationship.object == null) {
        result.errorMsg = "Relationship object is missing"; 
        result.correct = false; 
   } else {
       /*
            Checking optional attributes : observedAt, datasetId, property(ies), relationship(s)
       */
      for (let attributename in relationship) {
        if (attributename !== 'object') {
            if (attributename == 'type') {
                if (relationship[attributename] !== 'Relationship') {
                    result.errorMsg = "Relationship type of " + relationshipName + " should be equal to 'Relationship'";
                    result.correct = false; 
                    break; 
                } 
            } else if (attributename == 'observedAt'){
                date=new Date(relationship[attributename]);  
                if (isNaN(Date.parse(date))) {
                    result.errorMsg = "observedAt attribute of " + relationshipName + " is badly typed. Required type is Date."; 
                    result.correct = false; 
                    break; 
                }        
            } else if (attributename == 'datasetId') {
                if ((typeof(relationship[attributename]) !== 'string')) {
                    result.errorMsg = "datasetId attribute of " + relationshipName + " is badly typed. Required type is string, format uri"; 
                    result.correct = false; 
                    break;
                } else if (!(isUri.isValid(relationship[attributename]))) {
                    result.errorMsg= "Malformed uri for datasetId attribute value of " + relationshipName; 
                    result.correct = false; 
                    break; 
                }
            } else if ((relationship[attributename].type == 'Property') || (relationship[attributename].hasOwnProperty('value'))) {
                checkProperty(relationship[attributename], attributename, result); 
            } else if ((relationship[attributename].type == 'Relationship') || (relationship[attributename].hasOwnProperty('object'))){
                checkRelationship(relationship[attributename], attributename, result) ; 
            } 
        } 
    }
   }
   console.log (relationshipName + " bool is equal to: " + result.correct); 
}
 
function checkProperty (property, propertyName, result) {
    /*
        Checking mandatoty attributes 
    */
    let date = null; 
    if (property.type == null) {
        result.errorMsg = "Proprety type is missing"; 
        result.correct = false ; 
    } else if (property.value == null) {
        result.errorMsg = "Property value is missing"; 
        result.correct = false; 
    } else {
        /*
            checking optional attributes : observedAt, unitCode, datasetId, property (ies), relationship(s)
        */
        for (let attributename in property) {
            if (attributename !== 'value') {
                if (attributename == 'type') {
                    if (property[attributename] !== 'Property') {
                        result.errorMsg = "Property type of " + propertyName + " should be equal to 'Property'";
                        result.correct = false; 
                        break; 
                    }
                } else if (attributename == 'observedAt'){
                    date= new Date(property[attributename]);  
                    if (isNaN(Date.parse(date))) {
                        result.errorMsg = "observedAt attribute of " + propertyNam + " is badly typed. Required type is Date."; 
                        result.correct = false; 
                        break; 
                    } 
                } else if (attributename == 'unitCode'){
                    if ((typeof(property[attributename]) !== 'string')) {
                        result.errorMsg ="unitCode attribute of " + propertyNam + " is badly typed. Required type is string.";
                        result.correct = false; 
                        break; 
                    }           
                } else if (attributename == 'datasetId') {
                    if ((typeof(property[attributename]) !== 'string')) {
                        result.errorMsg = "datasetId attribute of " + propertyNam + " is badly typed. Required type is string, format uri"; 
                        result.correct = false; 
                        break; 
                    } else if (!(isUri.isValid(property[attributename]))) {
                        result.errorMsg= "Malformed uri for datasetId attribute value of " + propertyNam; 
                        result.correct = false; 
                        break; 
                    }
                } else if ((property[attributename].type == 'Property') || (property[attributename].hasOwnProperty('value'))){
                    checkProperty(property[attributename], attributename, result); 
                } else if ((property[attributename].type == 'Relationship') || (property[attributename].hasOwnProperty('object'))) {
                    checkRelationship(property[attributename], attributename, result) ; 
                }
            } 
        }
    }
    console.log (propertyName + " bool is equal to: " + result.correct); 
}

function entityValidator (reqBody) {
    var result = {
        correct : true, 
        errorMsg : ""
    }; 
    /*
        enumeration regrouping possible values of geoProperty key value. 
    */
    
    const geoKey = [
        'location', 
        'observationSpace', 
        'operationSpace'
    ]; 

    /*
        Checking mandatory attributes : id and type.
    */
    if (reqBody.id==null){
        result.errorMsg = "Entity id is missing";
        result.correct = false; 
    }else if (reqBody.type==null){
        result.errorMsg= "Entity type is missing";
        result.correct = false; 
    }else{
        /*
        Checking optional attributes : location, observationSpace, operationSpace, property(ies), relationship(s)
        */
        for (let attributename in reqBody) {
            if ((attributename !== 'id') && (attributename !== 'type')) {            
                if (reqBody[attributename].type == 'GeoProperty') {
                    console.log("Geoproperty type " + typeof(attributename)); 
                    if (!geoKey.includes(attributename)) {
                        result.errorMsg = "Possible values for a GeoProperty are : location, observationSpace and operationSpace."
                        result.correct = false; 
                        break; 
                    } else {
                        console.log ('Checking geoProperty' + attributename); 
                        checkGeoProperty (reqBody[attributename], attributename, result);
                    }
                
                } else if ((reqBody[attributename].type == 'Property') || (reqBody[attributename].hasOwnProperty('value'))) {
                    console.log('Checking property' + attributename); 
                    checkProperty(reqBody[attributename], attributename, result); 
                } else if( (reqBody[attributename].type == 'Relationship') || (reqBody[attributename].hasOwnProperty('object'))) {
                    console.log('Checking relationship' + attributename); 
                    checkRelationship(reqBody[attributename], attributename, result);         
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
    }
    return result; 
} 

module.exports = {entityValidator, checkGeoProperty}; 