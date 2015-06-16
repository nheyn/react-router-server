FROM nheyn/react-router-server:dev

COPY ./*-test.js /lib/react-router-server/__tests__/
COPY ./jestEnvironment.js /lib/react-router-server/

CMD npm test