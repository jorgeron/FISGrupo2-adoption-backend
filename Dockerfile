FROM node:9-alpine

WORKDIR /app

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
COPY ./models/user.js ./models/user.js

EXPOSE 3003

CMD npm start
