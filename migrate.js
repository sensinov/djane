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

const {
    entities,
    subscriptions,
    csourceRegistrations, 
    csourceSubscriptions,
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
}; 

const collectionNames = Object.keys(INDEXES_CONFIG); 


function bootstrap (){
	mongo.bootstrap(function (err, result){
    for (const collectionName of collectionNames) {
      const indexesDefinitions = INDEXES_CONFIG[collectionName]
      for (const { key, name } of indexesDefinitions) {
        mongo.createIndex(collectionName, key, { name, background: true }, function(err, result){
            if (err) {
                return console.error(err); 
                result = false; 
            } else {
                console.log('index', result, 'created', 'on', collectionName, 'collection'); 
            }           
        });
      }
    }
  });
}

bootstrap(); 






