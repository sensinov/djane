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

const express = require ('express');
const subscription=require('../notify/subscription'); 

const mongo = require('../lib/mongo'); 
const db=mongo.getdb(); 

const auth= require('../auth/auth'); 
const router = express.Router();

//entityOperations management
//POST /entityOperations/create
router.post('/entityOperations/create', auth.checkToken, function(req, res) {
	db.collection('entities').insertMany(req.body, function (err, result) {
    		if (err) return console.log(err)
		res.status(201)
		res.send({message: '201 Created'})
  	})
});


//POST /entityOperations/upsert
// if entityId does not exist then insert the entity into entities collection
// if entityId exists then 
//			if option query (flag) = "replace" then all the existing entity content shall be replaced
//			else if option query (flag) ="update" then existing entity content shall be updated

router.post('/entityOperations/upsert', auth.checkToken, function(req, res) {
	var flagValue = req.query.flag
	var Data = req.body 
	var entities_id = '[' 
	for (var j=0; j < Data.length; j ++ ) {
		entities_id = entities_id + ' { \'id \' : ' + Data[j].id +  '} ' 
	}
	entities_id = entities_id + ']'
	for (var i=0; i<Data.length; i++) {
		process_entity(Data[i], flagValue); 
	}
	res.status(200)
	res.send(entities_id);
	
});

function process_entity (entity, flagValue) {
	var entity_id = entity.id 
	//find if entity exists
	if (flagValue == 'replace') {
		try {
			db.collection('entities').replaceOne({'id': entity_id}, entity, { upsert: true })
		} catch (e) {
			console.log(e)
		}
	} else if (flagValue == 'update') {
		try {
			db.collection('entities').updateOne({'id' : entity_id}, {$set: entity})
		} catch (e) {
			console.log(e)
		}	
	} else if (flagValue == 'noOverwrite') {
		try {
			db.collection('entities').updateOne({'id' : entity_id}, {$set: entity})
		} catch (e) {
			console.log(e)
		}
	} else if (flagValue == null) {
		try {
			db.collection('entities').update({'id' : entity_id}, entity)
		} catch (e) {
			console.log(e)
		}
	}
	
}

//POST /entityOperations/update
router.post('/entityOperations/update', auth.checkToken, function(req, res) {
	var flagValue = req.query.flag;
	var Data = req.body ;
	var entities_id = '[' ;
	for (var j=0; j < Data.length; j ++ ) {
		entities_id = entities_id + '{ \'id \' : ' + Data[j].id +  '} '
	}
	entities_id = entities_id + ']';
	for (var i=0; i<Data.length; i++) {
		process_entity(Data[i], flagValue); 
	}
	res.status(200);
	res.send(entities_id);
	
});

//POST /entityOperations/delete
router.post('/entityOperations/delete', auth.checkToken, function(req, res) {
	var Data = req.body ;
	var entities_id = '[' ;
	for (var j=0; j < Data.length; j ++ ) {
		entities_id = entities_id + '{ \'id \' : ' + Data[j].id +  '}' ;
	}
	entities_id = entities_id + ']';
	for (var i=0; i<Data.length; i++) {
		db.collection('entities').findOneAndDelete({'id': Data[i].id}, (err, result) => {
    			if (err) return res.send(500, err)
  		})	
	}
	res.status(200);
	res.send(entities_id);

}); 

module.exports = router; 