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

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const createError = require('http-errors');
const config = require ('./config/config');
const mongo = require ('./lib/mongo'); 

const auth= require('./auth/auth'); 

//bodyParser middleware to parse the request body and place the result in request.body of a route.
app.use(bodyParser.json( {type : ['application/json', 'application/ld+json']}));
app.use(function (err, req, res, next) {
	let msg = {}; 
	try {
	  	if (err instanceof Error) {
			if (err.statusCode ) {
				msg = {
					"title" : "Bad Request - Invalid body",
					"type" : err.type, 
					"detail" : err.body
				}
		 	 	return res.status(err.statusCode ).send(msg)
			}
		} 
		throw err;    
	} catch (e) {
	  const finalError = new InternalServerError(err)
	  return res.status(finalError.statusCode).json()
	}
});  

//The urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object.
app.use(bodyParser.urlencoded({extended: true}));

var checker = function (req, res, next) {
	var headerAccept=req.header('Accept');
	const headerRegExp=RegExp('.*/.*'); 
	var headerContentType=req.header('Content-Type'); 
	var headerContentLength=req.header('Content-Length'); 
	if (req.method == "GET") {
		if ((headerRegExp.test(headerAccept)) || (headerAccept === 'undefined')) {
			next();
		} else {
			res.status(400);
			res.send('Please Check Accept request header');
		}
	} else if ((req.method == "POST") || (req.method == "PATCH")) {
		if (headerContentLength === undefined) {
			res.status(411);
			res.send('Please Check Content-Length request header');
		} else {
			if ((headerContentType == 'application/ld+json') || (headerContentType == 'application/json')) {
				next();
			} else {
				res.status(400);
				res.send('Please Check Content-Type request header');
			} 
		}
	} else if (req.method == "DELETE") {
		next();
	}

};

app.use(checker);

//Default page 
app.get('/', function(req, res) {
	res.send('Welcome to NGSI-LD Open source implementation');
});




function bootstrap (){
	mongo.bootstrap(function (err, result) {

		const entitiesRouter = require('./routes/entities');
		const subscriptionsRouter = require('./routes/subscriptions'); 
		const csRegistrationsRouter = require('./routes/csourceRegistrations');
		const csSubscriptionsRouter = require('./routes/csourceSubscriptions'); 
		const entityOperationsRouter = require ('./routes/entityOperations'); 
		const temporalRouter = require ('./routes/temporal'); 
		const usersRouter = require ('./routes/users'); 

		app.post('/login', auth.authenticate);

		// user Router 
		app.use(config.basePath, usersRouter); 
		
		// entities router
		app.use(config.basePath, entitiesRouter);

		//subscription router 
		app.use(config.basePath, subscriptionsRouter); 

		/*csourceRegistration router */
		app.use(config.basePath, csRegistrationsRouter);

		// csourceSubscription router 
		app.use(config.basePath, csSubscriptionsRouter); 

		//entityOperations router 
		app.use (config.basePath, entityOperationsRouter); 

		//entities temporal evolution Router
		app.use(config.basePath, temporalRouter); 

		const serer=app.listen(config.serverPort, function () {
			console.log('Listening on port: ' + config.serverPort);
		});
	}); 
}

bootstrap(); 

process.on('SIGTERM', function () {
	server.close( function () {
		console.log('Server terminated'); 
		process.exit(0); 
	})
}); 



