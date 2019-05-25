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
const serverPort = 3000;

//MongoDB config
const dbServer ='mongodb://';
const dbHost = '127.0.0.1';
const dbPort =  '27017';
const DataBaseName = 'ngsi_ld_bd';

// should be mongodb://localhost:27017/ngsi_ld_bd
const mongoDBHost = dbServer + dbHost + ':' + dbPort + '/'+ DataBaseName;

module.exports = {
    serverPort,
    mongoDBHost,
    DataBaseName
}

