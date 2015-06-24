FROM nheyn/react-router-server:dev

WORKDIR /var/www/

COPY ./src /var/www/src/
COPY ./staticFiles /var/www/staticFiles/
COPY ./package.json /var/www/
RUN npm install

CMD node start

EXPOSE 8080