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
var entityValidator = require('../models/entityModel'); 

const mongo = require('../lib/mongo'); 
const db=mongo.getdb(); 

const router = express.Router();

const config = require ('../config/config');
const auth= require('../auth/auth'); 
/*
    Get entities : 
        -- all entities when request query is null 
        -- a set of entities (filtred) when request query is not null
            The corresponding mongo request template is: db.entities.find({ $and: [{"type": "Vehicle"}, {"speed.value": 130} ]}) 

*/
router.get('/entities', auth.checkToken, function(req, res) {
    let filters = null; 
    if (JSON.stringify(req.query).length > 2) {
        var queryOptions = req.query;
        var keys = Object.keys(queryOptions);
        filters = {}; 
        let filter = []; 
        filters["$and"]=filter; 
        let queryTerm = null; 
        let keyValue = null; 
        for (var i = 0; i < keys.length; i++) {
            if (!isNaN(parseInt(queryOptions[keys[i]]))) {
               keyValue=parseInt(queryOptions[keys[i]]);
            } else {
                keyValue=queryOptions[keys[i]];
            }
            queryTerm = {
                [keys[i]]  : keyValue
            }
            filters["$and"].push(queryTerm); 
        }
        console.log('filters', JSON.stringify(filters)); 
    } 
    if (filters !== null) {
        db.collection('entities').find(filters).project({_id: 0}).toArray(function (err, result) {
            if (err) {
                return console.log(err);
            } else {
                res.status(200);
                res.send(result);
            }
        }); 
    } else {
        db.collection('entities').find().project({_id: 0}).toArray(function (err, result) {
            if (err) {
                return console.log(err);
            } else {
                res.status(200);
                res.send(result);

            }
        }); 
    }
    
});

router.get('/entities/:entityId', auth.checkToken, function(req, res) {
    db.collection('entities').findOne({'id': req.params.entityId}, {projection:{_id: 0}}, function (err, result) {
        if (err) {
            return console.log(err);
        } else {
            res.status(200);
            res.json(result);
        }}); 
});

function entityExistsInDB (id, res, req) {
    db.collection('entities').find({'id': id}).toArray(function(err, results) {
        if (results.length > 0) {
            res.status(409); 
            res.send('Resource already exists'); 
        } else {
            db.collection('entities').insertOne(req.body, {'forceServerObjectId':true},function (err, result) {
                if (err) {
                    return console.log(err);
                } else {
                    res.status(201);
                    res.set('Location', config.basePath+'/entities/'+id);
                    res.send(result.ops[0]);
                    subscription.notify(req.body);
                }
        
            }); 
        }
    }); 
}

router.post('/entities', auth.checkToken, function (req, res) {
    let verdict = entityValidator.entityValidator(req.body); 
    if (!verdict.correct) {
        res.status(404); 
        res.send('Invalid Request - wrong content: ' + verdict.errorMsg);
    } else { 
        id=req.body.id;       
        entityExistsInDB (id, res, req); 
    }
   
    
    
});

//POST /entities/{entityId}/attrs/
router.post('/entities/:entityId/attrs/', function (req, res) {
    var updateObject = req.body;
    db.collection('entities').updateOne({'id' : req.params.entityId}, {$set: updateObject}, function (err, result) {
        if (err) {
            return console.log(err);
        } else {
            res.status(204);
            res.send({message: '204 No Content'});
        }
    })
});

//PATCH /entities/{entityId}/attrs/
router.patch('/entities/:entityId/attrs', auth.checkToken, function (req, res) {
    var updateObject = req.body;
    db.collection('entities').updateOne({'id' : req.params.entityId}, {$set: updateObject}, function (err, result) {
        if (err) {
            return console.log(err);
        } else {
            res.status(204);
            res.send({message: '204 No Content'});
        }
    })
});

//PATCH /entities/{entityId}/attrs/{attrId}
//The body should contain entity fragment containing the elements of the attribute to be updated
router.patch('/entities/:entityId/attrs/:attrId', auth.checkToken, function (req, res) {
    var updateObject = req.body;
    var attributeId = req.params.attrId;
    db.collection('entities').updateOne({'id' : req.params.entityId}, {$set: updateObject}, function (err, result) {
        if (err) {
            return console.log(err);
        } else {
            res.status(204);
            res.send({message: '204 No Content'});
        }
    })
});


//DELETE /entities/{entityId}/attrs/{attrId}
router.delete('/entities/:entityId', auth.checkToken, function (req, res) {
    db.collection('entities').findOneAndDelete({'id': req.params.entityId}, function (err, result) {
        if (err) {
            return res.send(500, err)
        } else {
            res.status(204);
            res.send({message: '204 Deleted'});
        }
    })
});




module.exports = router;
