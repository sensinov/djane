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
 *         conception, implementation, test and documentation.
 *     Ghada Gharbi (Project co-founder) - Management and initial specification,
 *         conception, implementation, test and documentation.
 * Authors: 
 * 		Ghada Gharbi < ghada.gharbi@sensinov.com >
 ******************************************************************************/

const NbOfEntitiesInstances = 1000; 
const NbOfProperties = 10; 
const NbOfRelationships = 10; 
const NbOfTypes= 10; 
const collection = 'entities'; 

const NGSI_LD_HOST_IP = 'http://127.0.0.1'; 
const NGSI_LD_HOST_PORT = 3000; 
const NGSI_LD_HOST = NGSI_LD_HOST_IP + ':' + NGSI_LD_HOST_PORT; 
const dataPeriod = 10; 

module.exports = {
    NbOfRelationships, 
    NbOfEntitiesInstances,
    NbOfProperties, 
    NGSI_LD_HOST, 
    NbOfTypes, 
    dataPeriod, 
    collection
}