//definimos la variable app con el archivo que hemos creado en el fichero app.js, donde hemos creado el servidor web.
var app = require('./server');

//configuramos el puerto de escucha del servidor express
var port = (process.env.PORT || 3001);

console.log("Iniciando servidor API...");

//Indicamos puerto en el que escuchará nuestra aplicación
app.listen(port, () => console.log(`Servidor listo, escuchando en puerto ${port}!`));




