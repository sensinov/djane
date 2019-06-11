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
const mongo = require ('./lib/mongo'); 
const bcrypt = require('bcrypt');
const saltRounds = 10;
const user = require ('./config/config'); 
let db; 

const {
    entities,
    subscriptions,
    csourceRegistrations, 
    csourceSubscriptions,
    users, 
  } = require('./config/dbconfig')

const INDEXES_CONFIG = {
  [entities]: [
    {
      key: {
        id: 1,
      },
      name: 'id',
    },
    {
      key: {
        type: 1,
      },
      name: 'type',
    },
    {
        key: {
          location: 1,
        },
        name: 'location',
    },
    {
        key: {
          observationSpace: 1,
        },
        name: 'observationSpace',
    },
    {
        key: {
          operationSpace: 1,
        },
        name: 'operationSpace',
    },
  ], 
  [csourceRegistrations]: [
    {
      key: {
        id: 1,
      },
      name: 'id',
    },
    {
      key: {
        type: 1,
      },
      name: 'type',
    },
    {
      key: {
        name: 1,
      },
      name: 'name',
    },
    {
      key: {
        description: 1,
      },
      name: 'description',
    },
    {
      key: {
        expires: 1,
      },
      name: 'expires',
    },
    {
      key: {
        endpoint: 1,
      },
      name: 'endpoint',
    },
  ], 
  [subscriptions] : [
    {
      key: {
        id: 1,
      },
      name: 'id',
    },
    {
      key: {
        type: 1,
      },
      name: 'type',
    },
    {
      key: {
        name: 1,
      },
      name: 'name',
    },
    {
      key: {
        description: 1,
      },
      name: 'description',
    },
    {
      key: {
        timeInterval: 1,
      },
      name: 'timeInterval',
    },
    {
      key: {
        q: 1,
      },
      name: 'q',
    },
    {
      key: {
        csf: 1,
      },
      name: 'csf',
    },
    {
      key: {
        isActive: 1,
      },
      name: 'isActive',
    },
    {
      key: {
        expires: 1,
      },
      name: 'expires',
    },
    {
      key: {
        throttling: 1,
      },
      name: 'throttling',
    },
    {
      key: {
        status: 1,
      },
      name: 'status',
    },
  ], 
  [csourceSubscriptions] : [
    {
      key: {
        id: 1,
      },
      name: 'id',
    },
    {
      key: {
        type: 1,
      },
      name: 'type',
    },
    {
      key: {
        name: 1,
      },
      name: 'name',
    },
    {
      key: {
        description: 1,
      },
      name: 'description',
    },
    {
      key: {
        timeInterval: 1,
      },
      name: 'timeInterval',
    },
    {
      key: {
        q: 1,
      },
      name: 'q',
    },
    {
      key: {
        csf: 1,
      },
      name: 'csf',
    },
    {
      key: {
        isActive: 1,
      },
      name: 'isActive',
    },
    {
      key: {
        expires: 1,
      },
      name: 'expires',
    },
    {
      key: {
        throttling: 1,
      },
      name: 'throttling',
    },
    {
      key: {
        status: 1,
      },
      name: 'status',
    },
  ], 
  [users]: [
    {
      key: {
        username: 1,
      },
      name: 'username',
    },
  ],
}; 

const collectionNames = Object.keys(INDEXES_CONFIG); 


function createCollectionsIndex () {
  let promises = []; 
  let Index = null; 
  for (const collectionName of collectionNames) {
    const indexesDefinitions = INDEXES_CONFIG[collectionName]
    for (const { key, name } of indexesDefinitions) {
      Index = new Promise (function(resolve, reject) {
        mongo.createIndex(collectionName, key, { name, background: true }, function(err, result){
          if (err) {
            return console.error(err); 
            reject('error'); 
          } else {
            console.log('index', result, 'created', 'on', collectionName, 'collection'); 
            resolve('ok');             
          }           
        });
      }); 
      promises.push(Index);      
    }
  } 
  
  Promise.all(promises).then(function() {
      console.log('done'); 
      process.exit(0); 
  });
}

function createUser () {
  user.password = bcrypt.hashSync(user.password, saltRounds);
  const myuser = {
    "username" : user.username, 
    "password" : user.password
  }; 

  db=mongo.getdb(); 
  db.collection('users').insertOne(myuser, {'forceServerObjectId':true},function (err, result) {
    if (err) {
        return console.log(err);
    } else {
        console.log('user successfully created!!')
    }

  }); 
}

function bootstrap (){
	mongo.bootstrap(function (err, result){
    createUser() ; 
    createCollectionsIndex();  
  });
}

bootstrap(); 
