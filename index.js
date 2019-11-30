//Importamos la variable app que hemos creado en el fichero app.js,
//donde hemos creado el servidor web.
var app = require('./app');
var port = (process.env.PORT || 3000);


app.get('/', (req, res) => res.send('Hello World!'));

//Indicamos puerto en el que escuchará nuestra aplicación
app.listen(port, () => console.log(`Example app listening on port ${port}!`));



