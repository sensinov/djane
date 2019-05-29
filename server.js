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
	var headerContentType=req.header('Content-Type')
	if (req.method == "GET") {
		if ((headerAccept == 'application/ld+json') || (headerAccept == 'application/json')) {
			next();
		} else {
			res.status(400);
			res.send('Please Check Accept request header');
		}
	} else if ((req.method == "POST") || (req.method == "PATCH")) {
		if ((headerContentType == 'application/ld+json') || (headerContentType == 'application/json')) {
			next();
		} else {
			res.status(400);
			res.send('Please Check Content-Type request header');
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
	mongo.bootstrap(function (err, result){
		const entitiesRouter = require('./routes/entities');
		const subscriptionRouter = require('./routes/subscriptions'); 
		const csRegistrationRouter = require('./routes/csourceRegistrations');
		const csSubscriptionRouter = require('./routes/csourceSubscriptions'); 
		const entityOperationsRouter = require ('./routes/entityOperations'); 
		const temporalRouter = require ('./routes/temporal')

		// entities router
		app.use('/', entitiesRouter);

		//subscription router 
		app.use('/', subscriptionRouter); 

		/*csourceRegistration router */
		app.use('/', csRegistrationRouter);

		// csourceSubscription router 
		app.use('/', csSubscriptionRouter); 

		//entityOperations router 
		app.use ('/', entityOperationsRouter); 

		//entities temporal evolution Router
		app.use('/', temporalRouter); 

		
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



