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

const config = require('../config/config');
const mongo = require('../lib/mongo'); 
const db=mongo.getdb(); 
let request = require('request');

function sendNotifications(notifsInfos,body) {
    for (let i=0; i<notifsInfos.length; i ++){
        notifsInfos[i].body=buildNotification(notifsInfos[i], body);
    }

    /*
        Prepare the notification to send
     */
    console.log('Built notification');
    for (let j=0; j<notifsInfos.length; j++){
        console.log(notifsInfos[j]);
    }

    /*
        Prepare the notification request
     */
    let method = "POST";
    let options = {
        method : method
    };

    /*
        Sending of notifications
     */
    for (let cursor=0; cursor < notifsInfos.length; cursor++ ){
        options.uri=notifsInfos[cursor].endpoint;
        options.headers= {
            "Content-Type" : notifsInfos[cursor].accept
        };
        options.json=notifsInfos[cursor].body;
        request(options, function (error, response, body) {
            if(error){
                console.log(error);
            }else{
                console.log(response.statusCode);
                console.log(body);
            }
        });
    }
}
/*
Function to get a random integer in a closed range
 */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}
/*
This notification builds the payload of the notification
 */
function buildNotification(notifInfos, body) {
    let notification = {
        "id" : "urn:ngsi-ld:Notification:"+getRandomIntInclusive(1, 100000),
        "type" : "Notification",
        "subscriptionId" : notifInfos.subscriptionId,
        "context" : "http://uri.etsi.org/ngsi-ld/notification",
        "notifiedAt": Date(),
        "data": body
    };
    return notification;
}

/*
This function returns the endpoints uris of subscribed servers.
It calls "getSubscription" function to get subcriptionsIds and then parse each subscription
representation to get notifications Uris.
 */
function getNotificationsUris (subList, body) {
    let notifsInfos=[];
    console.log('subscriptions List length' + subList.length);
    console.log('Corresponding Subscription(s) ')
    console.log(subList);
    for (let index=0; index<subList.length; index++){

        notifsInfos[index] = {
            "subscriptionId" : subList[index].id,
            "endpoint": subList[index].notification.endpoint.uri,
            "accept": subList[index].notification.endpoint.accept

        };

    }

    console.log('Extracted notifications URIs');
    for (let i=0; i<notifsInfos.length; i++){
        console.log(notifsInfos[i]);
    }

    sendNotifications(notifsInfos, body);
}


/* This function returns a tab of subscription Ids */
function notify (body) {
    let subsIds=[];
    //Variable defined to save the result of getting subscriptions list corresponding to created entities resources
    let subList=null;
    let subAttrs=getSubscriptionAttributes(body);
    let query='{"$and" : [{"entities.type": "'+ subAttrs[0] + '"}, {"watchedAttributes": {"$in" : [';
    for (let i=1; i < subAttrs.length; i++ ){
        query = query+ '"'+ subAttrs[i]+'"';
        if (i < subAttrs.length - 1) {
            query = query + ',';
        }
    }
    query = query + '] } } ] }';
    console.log(query);


    db.collection('subscriptions').find(JSON.parse(query)).toArray(function (err, result) {
        if (err) {
            return console.log(err);
        } else {
            sublist=result;
            getNotificationsUris(sublist, body);
        }
    });


}


/*
This function returns a collection of attributes values needed for subscription(s) search.
 */
function getSubscriptionAttributes(body) {
    let subAttributes=[body.type];
    for (var attributename in body) {
        if ((attributename !==  '_id') && (attributename !== 'id') && (attributename !== 'type')){
            subAttributes.push(attributename);
        }
    }

    /*Display Entity (ies) attributes */
    console.log('Extracted Attributes from Entity (ies) ')
    for (let i = 0; i < subAttributes.length; i++) {
        console.log(subAttributes[i]);
    }
    return subAttributes;
}

module.exports = {
    notify
}
