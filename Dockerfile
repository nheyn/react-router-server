FROM node:0.10

COPY ./src /lib/react-router-server/src/
COPY ./package.json /lib/react-router-server/

WORKDIR /lib/react-router-server/
RUN npm install
