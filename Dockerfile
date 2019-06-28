FROM node

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production
COPY . .

# Download a wait program, used with docker-compose
RUN curl -sO https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && chmod +x ./wait-for-it.sh

# The SERVER_PORT is the port exposed by the service
ENV SERVER_PORT=3000

# The mongodb is configured via the variables below
ENV DB_SERVER=mongodb:// DB_HOST=mongo DB_PORT=27017 DATABASE_NAME=ngsi_ld_bd


ENV AUTH=true

#CMD [ "npm", "start" ]
CMD npm run migrate ; npm start
