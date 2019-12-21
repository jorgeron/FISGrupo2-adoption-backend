//cargamos base de datos
var db = require('./database.js');

//importamos variables de entorno
const dotenv = require('dotenv');
dotenv.config();

// Cargamos los módulos de express y body-parser
var express = require('express');
var bodyParser = require('body-parser');

// Llamamos a express para poder crear el servidor
var app = express();

//aplicamos body-parser al objeto app
app.use(bodyParser.json());

//versionado de al API
var BASE_API_PATH = (process.env.VERSION || '/api/v1');

const homeRouter = require('./routes/home.js');
app.use(BASE_API_PATH,homeRouter);

const adoptionsRouter = require('./routes/adoptions.js');
app.use(BASE_API_PATH + '/adoptions',adoptionsRouter);

// exportamos este módulo para poder usar la variable app fuera de este archivo
module.exports = app;