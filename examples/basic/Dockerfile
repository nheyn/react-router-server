FROM nheyn/async-react-router:dev

WORKDIR /var/www/

COPY ./src /var/www/src/
COPY ./staticFiles /var/www/staticFiles/
COPY ./package.json /var/www/
RUN npm install --unsafe-perm

#MOVE into index.js
RUN npm install -g browserify
RUN npm install babelify
RUN browserify ./src/app.js -t babelify --outfile ./staticFiles/app.js

CMD node /var/www/src/index.js

EXPOSE 8080