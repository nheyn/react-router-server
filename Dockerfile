FROM nheyn/async-react-router:0.2.0

WORKDIR /lib/react-router-server/

### FOR SPEED ###
RUN npm install babel
RUN npm install express
RUN npm install react
RUN npm install react-router
RUN npm install jest-cli
RUN npm install babel-jest
### FOR SPEED ###

COPY ./src /lib/react-router-server/src/
COPY ./package.json /lib/react-router-server/

RUN npm install --unsafe-perm
