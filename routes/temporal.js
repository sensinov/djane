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
var configPath = require ('../config/config'); 
const mongo = require('../lib/mongo'); 
const db=mongo.getdb(); 

const auth = require ('../auth/auth'); 
const router = express.Router();

router.get(configPath.basePath+'/temporal/entities', auth.checkToken, function (req, res){
    res.status(422); 
    res.send('Operation Not Supported');  
}); 

router.post(configPath.basePath+'/temporal/entities', auth.checkToken, function (req, res) {
    res.status(422); 
    res.send('Operation Not Supported'); 
}); 

router.get(configPath.basePath+'/temporal/entities/:entityid', auth.checkToken, function (req, res) {
    res.status(422); 
    res.send('Operation Not Supported'); 
});

router.delete(configPath.basePath+'/temporal/entities/:entityId', auth.checkToken, function (req, res) {
    res.status(422); 
    res.send('Operation Not Supported'); 
}); 

router.post(configPath.basePath+'/temporal/entities/:entityId/attrs', auth.checkToken, function (req, res) {
    res.status(422); 
    res.send('Operation Not Supported'); 
}); 

router.delete(configPath.basePath+'/temporal/entities/:entityId/attrs/:attrId', auth.checkToken, function (req, res){
    res.status(422); 
    res.send('Operation Not Supported'); 
}); 

router.patch(configPath.basePath+'/temporal/entities/:entityId/attrs/:attrId/:instanceId', auth.checkToken, function (req, res){
    res.status(422); 
    res.send('Operation Not Supported'); 
}); 

router.delete(configPath.basePath+'/temporal/entities/:entityId/attrs/:attrId/:instanceId', auth.checkToken, function (req, res){
    res.status(422); 
    res.send('Operation Not Supported'); 
}); 


module.exports = router; 