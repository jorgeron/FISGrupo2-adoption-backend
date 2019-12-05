
// Cargamos los módulos de express y body-parser
var express = require('express');
var bodyParser = require('body-parser');

//Cargamos cors para evitar el cross origin restriction
var cors = require ('cors');

// Llamamos a express para poder crear el servidor
var app = express();

console.log("Starting API server...")
app.use(bodyParser.json());

//aplicamos el cors al objeto app basado en la libreria express
app.use(cors());

// exportamos este módulo para poder usar la variable app fuera de este archivo
module.exports = app;