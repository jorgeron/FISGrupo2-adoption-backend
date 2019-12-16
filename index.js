
//importamos la libreria para que app y db lean variables de entorno
require('dotenv').config();

//definimos la variable app con el archivo que hemos creado en el fichero app.js, donde hemos creado el servidor web.
var app = require('./server');


//configuramos el puerto de escucha del servidor express
var port = (process.env.PORT || 3001);

console.log("Starting API server at port..."+port);

//Realizamos aquí la conexión a la BD para levantar el servidor
const dbConnect = require('./database');
dbConnect().then(
    () => {
        //Si conexión BD correcta, levantamos servidor
        app.listen(port, () => console.log(`Escuchando en puerto ${port}!`));
    },
    err => {
        //Si no hay conexión, no levantamos servidor
        console.log('Error de conexión: '+err);
    }
)







