# Djane 
Open source implementation of ETSI ISG CIM standard known as NGSI-LD. An information model, representation format and open API intended to make it easier for end-users, IoT devices, open data sources and 3rd-party applications to exchange information.

## Prerequisites
* Node.js (https://nodejs.org)
* MongoDB (https://www.mongodb.com)

## Install dependencies 
Before starting the project, you have to install the node dependencies. To do so, run:  
```bash
npm install 
```
## Play the migrations
At this step, you will create indexes on collections before starting the server.
Before you run the following command, you have to start mongo service and create a database. 
As described in config file (/config/config.js), we start locally a mongo service and we create 'ngsi_ld_bd' database.  

```bash
npm run migrate
```

## NGSIL-LD server 
To start server, run: 
```bash
npm start
```
A server will start locally listenning on port 3000. The port number is configured in config file (/config/config.js). 

## First call
To test that you have correctly installed the server, you can run your first query
```bash
curl "http://localhost:3000/subscriptions" \
     -H 'Accept: application/ld+json'
```
This will return an empty set, since nothing has been created yet. Note that you must specify the accept header, otherwise you get an error. Look [here](https://forge.etsi.org/swagger/ui/?url=https://forge.etsi.org/gitlab/NGSI-LD/NGSI-LD/raw/master/spec/updated/full_api.json#/) for more information about the API.
