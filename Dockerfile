FROM nheyn/async-react-router:0.2.0

COPY ./src /lib/react-router-server/src/
COPY ./package.json /lib/react-router-server/

WORKDIR /lib/react-router-server/
RUN npm install --unsafe-perm
