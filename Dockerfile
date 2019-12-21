FROM node:9-alpine

WORKDIR /proyecto

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY index.js .
COPY server.js .
COPY database.js .
COPY verifytoken.js .

COPY tests .
COPY ./tests/server.test.js ./tests/
COPY ./tests/integration-db.test.js ./tests/
COPY jest.config.js .

COPY models .
COPY ./models/adoption.js ./models/

COPY routes .
COPY ./routes/adoptions.js ./routes/
COPY ./routes/home.js ./routes/



EXPOSE 3001

CMD npm start
