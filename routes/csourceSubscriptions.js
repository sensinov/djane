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
var subscriptionValidator = require('../models/subscriptionModel'); 

const mongo = require('../lib/mongo'); 
const db=mongo.getdb(); 

const config = require ('../config/config'); 

const auth= require('../auth/auth'); 
const router = express.Router();

//csourceSubscriptions management
router.get('/csourceSubscriptions', auth.checkToken, function(req, res) {
	console.log('get /csourceSubscriptions');
	db.collection('csourceSubscriptions').find().project({_id:0}).toArray(function (err, result){ 
    		if (err) return console.log(err)
		res.status(200)
    		res.send(result)
  	})
});

router.get('/csourceSubscriptions/:csourceSubscriptionsId', auth.checkToken, function(req, res) {
	db.collection('csourceSubscriptions').findOne({'id': req.params.csourceSubscriptionsId}, {projection:{_id: 0}}, function (err, result){ 
        if (err) return console.log(err)
        res.status(200)
        res.send(result)
    });
}); 

function cssubscriptionExistsInDB (id, req, res) {
    db.collection('csourceSubscriptions').find({'id': id}).toArray(function(err, results) {
        if (results.length > 0) {
            res.status(409); 
            res.send('Resource already exists'); 
        } else {
            db.collection('csourceSubscriptions').insertOne(req.body, {'forceServerObjectId':true}, function (err, result) {
                if (err) {
                    return console.log(err); 
                } else {
                    res.status(201); 
                    res.set('Location', config.basePath+'/csourceSubscriptions/'+id);
                    res.send(result.ops[0]); 
                }
          });
        }
    }); 
}
router.post('/csourceSubscriptions', auth.checkToken, function (req, res) {
    let verdict = subscriptionValidator.subscriptionValidator(req.body); 
    if (!verdict.correct) {
        res.status(404); 
        res.send('Invalid Request - wrong content: ' + verdict.errorMsg);
    } else {
        let id=req.body.id;  
        cssubscriptionExistsInDB (id, req, res); 
    }
}); 

//PATCH  /csourceSubscriptions/{subscriptionId}
//Subscription fragment including id, type and any another context source registration subscription filed to be changed 
router.patch('/csourceSubscriptions/:subscriptionId/attrs', auth.checkToken, function (req, res) {
    var updateObject = req.body; 
    db.collection('csourceSubscriptions').updateOne({'id' : req.params.entityId}, {$set: updateObject}, function (err, result) {
	if (err) return console.log(err)
	res.status(204)
	res.send({message: '204 No Content'})
    })
});

router.delete('/csourceSubscriptions/:csourceSubscriptionId', auth.checkToken, function (req, res) {
  	 db.collection('csourceSubscriptions').findOneAndDelete({'id': req.params.csourceSubscriptionId}, (err, result) => {
    		if (err) return res.send(500, err)
		res.status(204)
    		res.send({message: '204 No Content'})
  	})
});

module.exports = router; 