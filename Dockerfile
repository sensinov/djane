FROM node:slim

LABEL maintainer="thomas.gilbert@alexandra.dk"

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production
COPY . .

# The SERVER_PORT is the port exposed by the service
ENV SERVER_PORT=3000

# The mongodb is configured via the variables below
ENV DB_SERVER=mongodb:// DB_HOST=127.0.0.1 DB_PORT=27017 DATABASE_NAME=ngsi_ld_bd

CMD [ "npm", "start" ]
