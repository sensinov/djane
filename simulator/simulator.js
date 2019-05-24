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
 *         conception, implementation, test and documentation.
 *     Ghada Gharbi (Project co-founder) - Management and initial specification,
 *         conception, implementation, test and documentation.
 * Authors: 
 * 		Ghada Gharbi < ghada.gharbi@sensinov.com >
 ******************************************************************************/

var config = require('./config'); 
var request = require('request'); 
/*
    This function returns a random integer between a minimum value (included) and a maximum value (included).
*/

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}

/*
    This function generates a string composed of characters picked randomly from the set [A-Z]
    To get a character, the length parameter is equal to 1.  
*/
function makeLetter(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 
/*
    This function generates an entity object
*/
function generateEntity (entityType) {
     /*
        Define an entity object : static elements
    */ 
    var entity = {
        id : 'urn:ngsi-ld:' + entityType +':' + makeLetter(1)+Math.round(Math.random() * 100), 
        type : 'type'+entityType, 
        createdAt : Date(), 
        context : '["http://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld"]'
    }
    var nbofProperties = getRandomIntInclusive (1, config.NbOfProperties); 
    var nbofRelationships = getRandomIntInclusive (1, config.NbOfRelationships); 
    console.log('prop', nbofProperties, 'rel', nbofRelationships); 
    /*
        Definition of entity property template (static elements)
    */
    var entityProperty = {
        type : 'Property'
    }; 

    /* 
        Definition of relationship template 
    */ 
    var entityRelationship = {
        type : 'Relationship'
    }; 

    /*
        Dynamic addition of properties and relationships
    */

    for (let i=1; i<=nbofProperties; i++) {
        propertyName='property'+i; 
        entityProperty.value =  getRandomIntInclusive (0, 100); 
        entity[propertyName] = entityProperty; 

    }

    for (let j=1; j<=nbofRelationships; j++) {
        relationshipName= 'relationship'+j; 
        entityRelationship.object = "urn:ngsi-ld:" + makeLetter(16); 
        entity[relationshipName]= entityRelationship; 
    }

    return entity; 
}

/*
    This function creates an entity on the NGSI-LD server
*/
function createEntity (entity) {
    let method = "POST"; 
    let uri = config.NGSI_LD_HOST+'/'+config.collection; 
    let contentType = "application/ld+json"; 
    let options = {
        uri : uri, 
        method : method, 
        headers : {
            "Content-Type" : contentType 
        }, 
        json : entity
    }; 

    request(options, function (error, response, body) {
		if(error){
			console.log(error);
		}else{
			console.log('status code: ',response.statusCode);
			console.log('body', body);
		}
	});

}

/*
    This function: 
    -- creates an entity object 
    -- transforms the object in a json representation (call of converter module)
    -- send a post request to 
*/
function fireEntity(entityType) {
    //Entity object Generation 
    console.log('entity generation'); 
    const entity=generateEntity (entityType); 
    //create an entity
    console.log(entity); 
    createEntity(entity); 
}

function sendData () {
    for (let i=1; i<=config.NbOfTypes; i++) {
        for (let j=1; j<=config.NbOfEntitiesInstances; j++) {
            fireEntity(i); 
        }
        
    }
}

sendData(); 