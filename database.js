//importamos librerias mongoose y conectamos a la base
require('dotenv').config();
var mongoose = require ('mongoose');
var uri = process.env.URI;
var db = mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false}); //hay que conectar la base de datos para trabajar con mongodb
var connection = mongoose.connection;
connection.once('open',()=>{ 
    console.log("Conexion a la base de datos MongoDB correcta");   
});
