FROM node:0.10

### FOR SPEED ###
RUN npm install -g babel

WORKDIR /lib/react-router-server/
RUN npm install babel
RUN npm install express
RUN npm install react
RUN npm install react-router
RUN npm install jest-cli
RUN npm install babel-jest
### FOR SPEED ###

WORKDIR /lib/async-react-router/
RUN git clone https://github.com/nheyn/async-react-router.git
RUN npm install --unsafe-perm

WORKDIR /lib/react-router-server/
COPY ./src /lib/react-router-server/src/
COPY ./package.json /lib/react-router-server/
RUN npm install --unsafe-perm
