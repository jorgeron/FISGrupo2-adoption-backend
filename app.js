
// Cargamos los módulos de express y body-parser
var express = require('express')
var bodyParser = require('body-parser')

// Llamamos a express para poder crear el servidor
var app = express()

console.log("Starting API server...")
app.use(bodyParser.json())

// exportamos este módulo para poder usar la variable app fuera de este archivo
module.exports = app;