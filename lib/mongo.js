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

const config = require('../config/config'); 
const MongoClient = require('mongodb').MongoClient;


let connectedClientToDb
function getClient (callback) {
    if (!connectedClientToDb) {
        console.log('Trying to connect to DB', config.mongoDBHost+'/'+config.dbName); 
        MongoClient.connect(config.mongoDBHost, {useNewUrlParser: true}, function (err, client){
            if (err) {
                console.error(err); 
                return callback(err); 
            }
            connectedClientToDb = client.db(config.dbName); 
            console.log('Conncected to DB: ' + config.mongoDBHost+'/'+config.dbName); 
            callback (null, connectedClientToDb)
        }); 
    } else {
        callback(null, connectedClientToDb) 
    }
    
}

let db; 
function bootstrap (callback) {
    getClient(function (err, result){
        db=result; 
        callback(err, db); 
    }); 

}

function getdb (){
    return db; 
}

function createIndex (collectionName, key, options, callback) {
   getdb().createIndex(collectionName, key, options, callback); 
}

module.exports = {bootstrap, getdb, createIndex}; 
