FROM nheyn/react-router-server:0.1.0

WORKDIR /var/www/

COPY ./src /var/www/src/
COPY ./public /var/www/public/
COPY ./index.js /var/www/
COPY ./package.json /var/www/
RUN npm install --unsafe-perm				# --unsafe-perm is for root user used by docker

CMD node index.js

EXPOSE 80
