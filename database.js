//importamos librerias mongoose y conectamos a la base
var mongoose = require ('mongoose');

//inicializamos uri con la variable de entorno que tiene la cadena de conexion a la base de datos
const URI_DB = (process.env.URI || "mongodb+srv://fis2019g2:PAv2HuMOKNPtQh2l@cluster0-g8apu.mongodb.net/test?retryWrites=true&w=majority");
const URI_TESTING_DB = (process.env.URI_TESTING_DB || "mongodb+srv://fis2019g2:PAv2HuMOKNPtQh2l@cluster0-g8apu.mongodb.net/testing_db?retryWrites=true&w=majority");

const dbConnect = function(integrationTesting) {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Error en conexión a BD: '));
    
    if(integrationTesting) {
        return mongoose.connect(URI_TESTING_DB, {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false});
    }
    
    return mongoose.connect(URI_DB, {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify: false});
}

module.exports = dbConnect;