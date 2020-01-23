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

const express = require ('express');
const router = express.Router();

const mongo = require('../lib/mongo'); 
const db=mongo.getdb(); 

const auth= require('../auth/auth'); 
const bcrypt = require('bcrypt');
const saltRounds = 10;



//Get All users 
router.get('/users', auth.checkToken, function(req, res){
    db.collection('users').find().project({_id: 0}).toArray(function (err, result) {
        if (err) {
            return console.log(err);
        } else {
            res.status(200);
            res.send(result);

        }
    }); 
}); 

//get a particular user (by username)
router.get('/users/:username',  auth.checkToken, function(req,res){
    db.collection('users').find({'username': req.params.username}).project({_id: 0}).toArray(function (err, result) {
        if (err) {
            return console.log(err);
        } else {
            res.status(200);
            res.send(result);
        }
    })
}); 

//create a new user 
router.post('/users',  auth.checkToken, function(req,res){
    //encrypt password
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    db.collection('users').insertOne(req.body, {'forceServerObjectId':true},function (err, result) {
        if (err) {
            return console.log(err);
        } else {
            res.json({status: "success", message: "User added successfully!", data: null});
        }

    }); 
}); 

//delete a user (by username)
router.delete('/users/:username',  auth.checkToken, function(req, res){
    db.collection('users').findOneAndDelete({'username': req.params.username}, function (err, result) {
        if (err) {
            return res.send(500, err)
        } else {
            res.status(204);
            res.send({message: '204 Deleted'});
        }
    })
}); 


module.exports = router; 