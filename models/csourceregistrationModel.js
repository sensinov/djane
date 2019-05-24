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

var geoProperty = require('./entityModel'); 
var isUri = require('isuri');
/*
    Function to check an item of entities attribute of infomation element of csourceRegistration resource
    Each item is of type of EntityInfo. 
    Input: 
        -- entityInfo : json object which corresponds to an item of information item
        -- result: object containing the verdict of csourceRegistration (could be modified)
*/
function checkEntityInfo(entityInfo, index, result){
    /*
        Checking of mandatory attribute : type
    */
    if (entityInfo.type == null) {
        result.correct= false; 
        result.errorMsg="id attribute of infomation item of index n° " + index + " is required. Id is a mandatory attribute."
    } else {
        /*
            Checking of data types of each element of entityInfo
        */
        for (let attributename in entityInfo) {
            if (attributename == 'id') {
                if (typeof(entityInfo[attributename]) !== 'string'){
                    result.correct= false; 
                    result.errorMsg = "id attribute of infomation item of index n° " + index + " type should be a string."; 
                    break; 
                }
            } else if (attributename == 'idPattern') {
                if (typeof(entityInfo[attributename])!== 'string'){
                    result.correct= false; 
                    result.errorMsg = "idPattern attribute of infomation item of index n° " + index + " type should be a string."; 
                    break; 
                }
            } else if (attributename == 'type') {
                if (typeof(entityInfo[attributename])!== 'string'){
                    result.correct= false; 
                    result.errorMsg = "type attribute of infomation item of index n° " + index + " type should be a string."; 
                    break; 
                }
            }
        }
    }
}; 
/*
    Function to check an item of information attribute of csourceRegistration resource 
    Each item is of type of RegistrationInfo.
    Input : 
        -- regitrationInfo : json object which corresponds to an item of the information attribute. 
        -- index : the index of registrationInfo
        -- result: object containing the verdict of csourceRegistration (could be modified)

*/
function checkRegistrationInformation (registrationInfo, index, result) {
    let typeProperties = true; 
    let typeRelationships = true; 
    /*
        Checking of manadatory attributes : entities, properties and relationships. 
    */
    if (registrationInfo.entities == null) {
        result.correct = false; 
        result.errorMsg = "entities attribute of element n° " + index + " is messing. It's a mandatory attribute."
    } else if (registrationInfo.properties == null ) {
        result.correct = false; 
        result.errorMsg = "propeties attribute of element n° " + index + " is messing. It's a mandatory attribute."
    } else if (registrationInfo.relationships == null ) {
        result.correct = false; 
        result.errorMsg = "relationships attribute of element n° " + index + " is messing. It's a mandatory attribute."
    } else {
        /*
            Checking of data types of each element of registrationInformation
        */
        for (let attributename in registrationInfo) {
            if (attributename == 'properties') {
                if (!(Array.isArray(registrationInfo[attributename]))){
                    result.correct = false; 
                    result.errorMsg = "information properties attribute type should be array."; 
                    break; 
                } else {
                    for (let j=0; j<registrationInfo[attributename].length; j++) {
                        if (typeof((registrationInfo[attributename])[j]) !== 'string') {
                            typeProperties = false; 
                            break; 
                        }
                    }
                    if (typeProperties == false) {
                        result.correct = false; 
                        result.errorMsg = "properties attribute elements must be of type string"; 
                        break; 
                    }
                }
            } else if (attributename == 'relationships') {
                if (!(Array.isArray(registrationInfo[attributename]))){
                    result.correct = false; 
                    result.errorMsg = "information relationships attribute type should be an array."; 
                    break; 
                } else {
                    for (let k=0; k<registrationInfo[attributename].length; k++) {
                        if (typeof((registrationInfo[attributename])[k]) !== 'string') {
                            typeRelationships = false; 
                            break; 
                        }
                    }
                    if (typeRelationships == false) {
                        result.correct = false; 
                        result.errorMsg = "relationships attribute elements must be of type string"; 
                        break; 
                    }
                }
            } else if (attributename == 'entities') {
                if (!(Array.isArray(registrationInfo[attributename]))) {
                    result.correct = false; 
                    result.errorMsg = "information entities attribute type should be an array."; 
                    break; 
                } else {
                    registrationInfo[attributename].forEach(function(value, index) {
                        checkEntityInfo(value, index, result); 
                    }); 
                }
            }
        }
    }

};

/* 
    Function to validate the information attribute of a CsourceRegistration Resource
    Input : 
        -- csourceRegistrationInfo: an array of RegistrationInfo data type 
        -- result: object containing the verdict of csourceRegistration (could be modified)
*/
function  checkCsRegistrationInformation(csourceRegistrationInfo, result) {
    for (let i=0; i<csourceRegistrationInfo.length; i ++) {
        console.log("Checking element n° " + i + " of cSourceRegistration instance"); 
        checkRegistrationInformation (csourceRegistrationInfo[i], i, result);
    }
};


/*
    Function to check csourceRegistration attributes with data type TimeInterval (namely observationInterval & managementInterval)
    input : 
        -- attributename : possible values are : observationInterval and managementInterval
        -- csourceRegistrationTimeInterval : a json object which data type is TimeInterval
        -- result: object containing the verdict of csourceRegistration (could be modified) 
*/

function checkTimeInterval (attributename, csourceRegistrationTimeInterval, result) {
    /*
        Checking of mandatory attribute : start
    */ 
    let date = null; 
    if (csourceRegistrationTimeInterval.start == null ) {
        result.correct = false; 
        result.errorMsg = "start attribute of "+ attributename +" is missing. It is a mandatory attribute.";
    } else{
        for (let element in csourceRegistrationTimeInterval){
            if (element == 'start') {
                date = new (csourceRegistrationTimeInterval[element]);
                if (isNaN(Date.parse(date))) {
                    result.errorMsg = "start attribute of " + attributename+ " is badly typed. Required type is Date."; 
                    result.correct = false; 
                    break; 
                }        
            } else if (element == 'end') {
                date = new (csourceRegistrationTimeInterval[element]);
                if (isNaN(Date.parse(date))) {
                    result.errorMsg = "start attribute of " + attributename+ " is badly typed. Required type is Date."; 
                    result.correct = false; 
                    break; 
                }  
            }
        }
    }

};

/*
    function to validate a csourceRegistraionSchema
    input : the request Body
    output : object containing a bool and error message (in the case of no valid imput) namely result
*/
function csourceRegistrationValidator (reqBody) {
    var result = {
        correct : true, 
        errorMsg : ""
    }; 
    let date = null; 
    /*
        Check mandatory attributes : type, information, endpoint
    */
    if (reqBody.type == null) {
        result.correct = false;  
        result.errorMsg = "csourceRegistration type is missing. It is a mandatory attribute."
    } else if (reqBody.information == null) {
        result.correct = false; 
        result.errorMsg= "csourceRegistration information is missing. It is a mandatory attribute."
    } else if (reqBody.endpoint == null) {
        result.correct = false; 
        result.errorMsg = "csourceRegistration endpoint is missing. It is a mandatory attribute."
    } else {
        for (let attributename in reqBody) {
            console.log ('Checking of ' + attributename); 
            if (attributename == 'type') {
                if (reqBody[attributename] !== 'ContextSourceRegistration') {
                    result.correct = false; 
                    result.errorMsg = "csouceRegistration type value should be equal to 'ContextSourceRegistration'."; 
                    break; 
                }
            } else if (attributename == 'name') {
                if (reqBody[attributename].length == 0) {
                    result.correct = false; 
                    result.errorMsg = "csourceRegistration name attribute should not be an empty string."; 
                    break; 
                }
            } else if (attributename == 'description') {
                if (reqBody[attributename].length == 0) {
                    result.correct = false; 
                    result.errorMsg = "csourceRegistration description attribute should not be an empty string."; 
                }
            } else if (attributename == 'information') {
                if (!(Array.isArray(reqBody[attributename]))) {
                    result.correct = false; 
                    result.errorMsg = "csourceRegistration information attribute type should be an array."; 
                    break; 
                } else if (reqBody[attributename].length == 0) {
                    result.correct = false; 
                    result.errorMsg = "csourceRegistration information attribute should not be an empty array."; 
                    break; 
                } else {
                    checkCsRegistrationInformation(reqBody[attributename], result); 
                }
            } else if (attributename == 'observationInterval') { 
                checkTimeInterval (attributename, reqBody[attributename], result); 
            } else if (attributename == 'managementInterval') {
                checkTimeInterval (attributename, reqBody[attributename], result); 
            } else if (attributename == 'location') {
                geoProperty.checkGeoProperty(reqBody[attributename], attributename, result); 
            } else if (attributename == 'observationSpace') {
                geoProperty.checkGeoProperty(reqBody[attributename], attributename, result); 
            } else if (attributename == 'operationSpace') {
                geoProperty.checkGeoProperty(reqBody[attributename], attributename, result); 
            } else if (attributename == 'expires') {
                date=new Date(reqBody[attributename]);  
                if (isNaN(Date.parse(date))) {
                    result.errorMsg = "expires attribute of contextSourceRegistration is badly typed. Required type is Date."; 
                    result.correct = false; 
                    break; 
                }        
            } else if (attributename == 'endpoint') {
                if ((typeof(reqBody[attributename]) !== 'string')) {
                    result.errorMsg = "endpoint attribute of contextSouceRegistration is badly typed. Required type is string, format uri"; 
                    result.correct = false; 
                    break;
                } else if (!(isUri.isValid(reqBody[attributename]))) {
                    result.errorMsg= "Malformed uri for contextSourceRegistration attribute value. ";  
                    result.correct = false; 
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

module.exports = {csourceRegistrationValidator, checkEntityInfo}; 
