FROM node:latest AS build
WORKDIR /build

COPY package*.json ./
RUN npm install --production

# Use the node:slim base image to save 600mb space
FROM node:slim
WORKDIR /usr/src/app

# Copy the node modules and compiled C/C++ libraries
COPY --from=build /build /usr/src/app

# Copy JavaScript and everything else
COPY . .

# Download a wait program, used with docker-compose
RUN curl -sO https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh && chmod +x ./wait-for-it.sh

# The SERVER_PORT is the port exposed by the service
ENV SERVER_PORT=3000

# The mongodb is configured via the variables below
ENV DB_CONNECTION_URI=mongodb://mongo:27017

# Use JWT authentication or not
ENV AUTH=true

#CMD [ "npm", "start" ]
CMD npm run migrate ; npm start
