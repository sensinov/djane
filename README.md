## Djane 
Open source implementation of ETSI ISG CIM standard known as NGSI-LD. An information model, representation format and open API intended to make it easier for end-users, IoT devices, open data sources and 3rd-party applications to exchange information.

## Onboarding
* install `nodejs` 

```bash
sudo apt-get install nodejs && \
sudo apt-get install npm 
```

* install mongodb (https://docs.mongodb.com/manual/installation/)

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
npm run start
```
A server will start locally listenning on the port 3000. Port number is configured in config file (/config/config.js). 
