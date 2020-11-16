FROM node:10.13.0-alpine
# Set the working directory for the container
WORKDIR /usr/src/app
# Copy package.json
COPY package.json .
COPY .env .
RUN apk add --no-cache bash

RUN npm install
ADD . /usr/src/app


