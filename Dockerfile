FROM node:9-alpine

WORKDIR /proyecto

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY index.js .
COPY server.js .
COPY database.js .

COPY tests .
COPY ./tests/server.test.js ./tests/
COPY ./tests/integration-db.test.js ./tests/
COPY jest.config.js .

COPY models .
COPY ./models/adoption.js ./models/

EXPOSE 3001

CMD npm start
