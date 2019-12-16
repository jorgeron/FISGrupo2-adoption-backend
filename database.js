//importamos librerias mongoose y conectamos a la base
var mongoose = require ('mongoose');
require('dotenv').config();

//inicializamos uri con la variable de entorno que tiene la cadena de conexion a la base de datos
const URI_DB = process.env.URI;
const URI_TESTING_DB = process.env.URI_TESTING_DB;

const dbConnect = function(integrationTesting) {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Error en conexión a BD: '));
    
    if(integrationTesting) {
        return mongoose.connect(URI_TESTING_DB, {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false});
    }
    
    return mongoose.connect(URI_DB, {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false});
}

module.exports = dbConnect;

//conectamos a la base de datos
/*
mongoose.connect(URI_DB,{useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false}); //hay que conectar la base de datos para trabajar con mongodb
var connection = mongoose.connection;
connection.once('open',()=>{ 
    console.log("Conexion a la base de datos MongoDB correcta");   
});
*/
