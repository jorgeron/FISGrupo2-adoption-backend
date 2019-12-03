//Importamos la variable app que hemos creado en el fichero app.js,
//donde hemos creado el servidor web.
var app = require('./app');
var base = require ('./db');


var Usuario = require ('./modelos/usuarios'); //crea un objeto tipo usuarios basado en el modelo descrito en usuarios.js
var Mascota = require ('./modelos/mascotas'); //crea un objeto tipo mascotas basado en el schema del modelo descrito en masctoas.js
var Adopcion = require ('./modelos/adopciones'); //crea un objeto tipo adopciones basado en el schema del modelo descrito en adopciones.js
 


var port = (process.env.PORT || 3000);


app.get('/', (req, res) => res.send('Hello World!'));

app.post('/addUser', function(request,response){
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

app.post('/addPet', function(request,response){
    var mascota = new Mascota(request.body); // crea un usario, para cargar las variables del body y luego las pasara a la base de datos
  
    //funcion de mongoose para grabar los datos que se cargaron en la variable product, a la base de datos.
    mascota.save(function(err,savedMascota){
        if (err){
            response.status(500).send({error:"hubo un error"});
        }else {
            response.status(200).send(savedMascota);
        }
    });
});

app.get('/findUser',function(request,response){
    // para buscar todos los productos, uso la variable del tipo objeto Product que en la que cargo el esquema en la linea 10 de codigo
     Usuario.find({},function(err,usuarios) {
         if (err){
             response.status(500).send({error:"hubo un error, no se pudieron consultar los productos"});
         }else {
             response.status(200).send(usuarios);
         }
     });
 });

 app.get('/findPet',function(request,response){
    // para buscar todos los productos, uso la variable del tipo objeto Product que en la que cargo el esquema en la linea 10 de codigo
     Mascota.find({},function(err,mascotas) {
         if (err){
             response.status(500).send({error:"hubo un error, no se pudieron consultar los productos"});
         }else {
             response.status(200).send(mascotas);
         }
     });
 });

//Indicamos puerto en el que escuchará nuestra aplicación
app.listen(port, () => console.log(`Escuchando en puerto ${port}!`));



