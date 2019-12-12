
// Cargamos los módulos de express y body-parser
var express = require('express');
var bodyParser = require('body-parser');

//configuramos el puerto de escucha del servidor express
var port = (process.env.PORT || 3001);

//Cargamos cors para evitar el cross origin restriction
var cors = require ('cors');

// Llamamos a express para poder crear el servidor
var app = express();

console.log("Starting API server...")

//aplicamos el cors y body-parser al objeto app
app.use(bodyParser.json());
app.use(cors());

//Indicamos puerto en el que escuchará nuestra aplicación
app.listen(port, () => console.log(`Escuchando en puerto ${port}!`));

// exportamos este módulo para poder usar la variable app fuera de este archivo
module.exports = app;