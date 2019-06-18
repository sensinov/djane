# djane 
Open source implementation of ETSI ISG CIM standard known as NGSI-LD. An information model, representation format and open API intended to make it easier for end-users, IoT devices, open data sources and 3rd-party applications to exchange information.

## Tutorials 
[Smart parking sample](https://github.com/sensinov/djane/blob/master/tutorials/REST%20API.md)  

## Prerequisites
* Node.js (https://nodejs.org)
* MongoDB (https://www.mongodb.com)

## Install dependencies 
Before starting the project, you have to install the node dependencies. To do so, run:  
```bash
npm install 
```
## Play the migrations
At this step, you will create indexes on collections and default user before starting the server.
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

## Authentication
Authentication mechanism based on jwt. The authentication endpoint is *localhost:3000/login*. 
To retrieve a JSON Web Token from a default user (admin/admin4djane), valid for an hour by default, run the following query: 
```bash 
curl -d '{"username":"admin", "password":"admin4djane"}' -H 'Content-Type: application/json' -X POST "http://localhost:3000/login"
```
The user credentials are configured in config file (/config/config.js). 

## First call
To test that you have correctly installed the server, you can run your first query
```bash
curl -H 'Accept: application/ld+json' -H 'X-AUTH-TOKEN: insert_genereted_jwt' -X GET "http://localhost:3000/ngsi-ld/v1/entities"
```
This will return an empty set, since nothing has been created yet. Note that you must specify the accept header, otherwise you get an error. Look [here](https://forge.etsi.org/swagger/ui/?url=https://forge.etsi.org/gitlab/NGSI-LD/NGSI-LD/raw/master/spec/updated/full_api.json#/) for more information about the API.

## Getting started with docker
Here is a simple example that will get you up and running with docker. It is easy to build, run and you can even deploy the images to your own repository if you like. This is not meant to be a docker tutorial, but just a basic introduction to get djane runnnig.

### Build
Building the docker file follows the usual docker build command
```bash
docker build . -t insert_name_here/djane:1.0.0
```
Of course you should replace the tag with whatever you prefer.

### Run
If you already have a running mongo database on your local machine, it is easiest to make djane run on your hosts network. If not just follow these steps to get a nice and isolated instance up and running.
```bash
docker network create djanenet
```
That will create the docker network which we will run our mongodb on and our djane service on.
```bash
docker run -d -v $PWD/data:/data/db --name mongodb --network djanenet mongo
```
Notice the port is not mounted and that data will be stored on your local machine in a data folder. According to the official documentation [here](https://hub.docker.com/_/mongo) running host mounted volumes on Windows and OSX is not officially supported, so if you run into problems follow the documentation.
```bash
docker run --rm -it --network djanenet -e DB_HOST=mongodb insert_name_here/djane:1.0.0 node migrate
```
This step should run the migrate command against your mongodb.
```bash
docker run -d --network djanenet -p 3000:3000 -e DB_HOST=mongodb insert_name_here/djane:1.0.0
```
Notice here that we are setting the environment variable DB_HOST to mongodb. This is the hostname that the mongodb will have in our example. If you are running against a different mongodb, then use the IP or hostname that makes sense for you. Check the Dockerfile for other configurable values.
```bash
docker run -d --network host -p 3000:3000 insert_name_here/djane:1.0.0
```
The final example above is in the case that you are running your mongodb natively on your localhost machine.

## Start with docker-compose

Using docker-compose is not recommended for a production environment, and the services launched are only for testing and evaluation purposes.

### Install prerequisites
* Docker Compose (https://docs.docker.com/compose/install/) 

### Running the services 
A YAML file, namely 'docker-compose.yml', is defined to configure the application’s services. This defines two dockers containers:
* djaneio which represents the NGSI-LD service.
* mongo which represents the persistence layer. 

To launch the services execute the command below:
```bash 
docker-compose up
```
