## djane 
Open source implementation of ETSI ISG CIM standard known as NGSI-LD.


## What is NGSI-LD?
NGSI-LD, an information model, representation format and open API intended to make it easier for end-users, IoT devices, open data sources (for example in smart city) and 3rd-party applications to exchange information. The information model, grounded on RDF, leverages the Property Graph information model. The representation format chosen is JSON-LD, while the open API has been defined using HTTP REST bindings. 

## Onboarding
* install `nodejs` 

```bash
sudo apt-get install nodejs && \
sudo apt-get install npm 
```

* install mongodb (https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

* play the migrations 
```bash
node migrate.js
```
## NGSIL-LD server 

To start server, run: 
```bash
node server.js
```
