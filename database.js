//importamos librerias mongoose y conectamos a la base
var mongoose = require ('mongoose');

//inicializamos uri con la variable de entorno que tiene la cadena de conexion a la base de datos
var uri = (process.env.URI||"mongodb+srv://fis2019g2:PAv2HuMOKNPtQh2l@cluster0-g8apu.mongodb.net/test?retryWrites=true&w=majority");

//conectamos a la base de datos
mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false}); //hay que conectar la base de datos para trabajar con mongodb
var connection = mongoose.connection;

connection.once('open',()=>{ 
    console.log("Conexion a la base de datos MongoDB correcta");   
});

module.exports = mongoose;