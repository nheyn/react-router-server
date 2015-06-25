FROM nheyn/react-router-server:dev

WORKDIR /var/www/

### FOR SPEED ###
#RUN npm install babel
#RUN npm install browserify
#RUN npm install react
#RUN npm install react-router
#RUN npm install express
### FOR SPEED ###

COPY ./src /var/www/src/
COPY ./staticFiles /var/www/staticFiles/
COPY ./index.js /var/www/
COPY ./package.json /var/www/
RUN npm install --unsafe-perm

CMD node index.js

EXPOSE 8080
