//Importamos la variable app que hemos creado en el fichero app.js,
//donde hemos creado el servidor web.
var app = require('./app');
var base = require ('./db');

var port = (process.env.PORT || 3000);


app.get('/', (req, res) => res.send('Hello World!'));

app.post('/usuario', function(request,response){
    var usuario = new Usuario(request.body); // crea un usario, para cargar las variables del body y luego las pasara a la base de datos
  
    //funcion de mongoose para grabar los datos que se cargaron en la variable product, a la base de datos.
    usuario.save(function(err,savedUsuario){
        if (err){
            response.status(500).send({error:"hubo un error"});
        }else {
            response.status(200).send(savedUsuario);
        }
    });
});

//Indicamos puerto en el que escuchará nuestra aplicación
app.listen(port, () => console.log(`Example app listening on port ${port}!`));



