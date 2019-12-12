//importamos la libreria para que app y db lean variables de entorno
require('dotenv').config();

//definimos la variable app con el archivo que hemos creado en el fichero app.js, donde hemos creado el servidor web.
var app = require('./app');

//importamos la variable db con el archivo que hemos creado en database.js, donde se define la conexion a la bd 
var db = require ('./database')

//cargamos los modelos de la base de datos
var User = require ('./models/user'); //crea un objeto tipo usuarios basado en el modelo descrito en usuarios.js
var Pet = require ('./models/pet'); //crea un objeto tipo mascotas basado en el schema del modelo descrito en masctoas.js
var Adoption = require ('./models/adoption'); //crea un objeto tipo adopciones basado en el schema del modelo descrito en adopciones.js
 

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/addUser', function(request,response){
    var user = new User(request.body); // crea un usario, para cargar las variables del body y luego las pasara a la base de datos
    //funcion de mongoose para grabar los datos que se cargaron en la variable usuario, a la base de datos.
    user.save(function(err,savedUser){
        if (err){
            response.status(500).send({error:"hubo un error al grabar el usuario"});
        }else {
           response.status(200).send(savedUser);
        }
    });
});

app.post('/addPet', function(request,response){
    var pet = new Pet(request.body); // crea una mascota, para cargar las variables del body y luego las pasara a la base de datos
   //funcion de mongoose para grabar los datos que se cargaron en la variable mascota, a la base de datos.
    pet.save(function(err,savedPet){
        if (err){
            response.status(500).send({error:"hubo un error al grabar la mascota"});
        }else {
            response.status(200).send(savedPet);
        }
    });
});

app.get('/findUser',function(request,response){
    // para buscar todos los usuarios, uso la variable del tipo objeto Usuario que en la que cargo el esquema
 if (!request.query.id) {
    User.find({},function(err,users) {
        if (err){
            response.status(500).send({error:"hubo un error, no se pudieron consultar los usuarios"});
        }else {
            response.status(200).send(users);
        }
    });
 } else {
    User.find({_id:request.query.id},function(err,users) {
        if (err){
            response.status(500).send({error:"hubo un error, no se pudieron consultar el usuario"});
        }else {
            response.status(200).send(users);
        }
    });
 }
 });

 app.get('/findPet',function(request,response){
    // para buscar todos las mascotas, uso la variable del tipo objeto mascota que en la que cargo el esquema 
    if (!request.query.id) {
    Pet.find({},function(err,pets) {
        if (err){
            response.status(500).send({error:"hubo un error, no se pudieron consultar las mascotas"});
        }else {
            response.status(200).send(pets);
        }
    });
   }else {
    Pet.find({_id:request.query.id},function(err,pets) {
        if (err){
            response.status(500).send({error:"hubo un error, no se pudo consultar la mascota"});
        }else {
            response.status(200).send(pets);
        }
    });
   }
 
    });

 app.post('/adoptions', async function(request,response){
    var adoption = new Adoption(request.body); // crea un usuario, para cargar las variables del body y luego las pasara a la base de datos
   //funcion de mongoose para grabar los datos que se cargaron en la variable adopcion, a la base de datos.
   //adoption.donor = request.body.donor;
   //adoption.receptor = request.body.receptor;
   //adoption.pet = request.body.pet;
   //adoption.status = request.body.status;
   //console.log (adoption);
await adoption.save(function(err,savedAdoption){
        if (err){
            console.log(err);
            response.status(500).send({error:"hubo un error al grabar la adopcion"});
        }else {
            response.status(200).send(savedAdoption);
        }
    });
});

//Find All
app.get('/adoptions', async function(request,response, next){
    //Si la petición trae una query, pasamos a la siguiente ruta
    var isQuery = Object.keys(request.query).length !== 0;
    if(isQuery) {
        next();
        return;
    }
    // para buscar todos las adopciones, uso la variable del tipo objeto Adoption que en la que cargo el esquema 
await Adoption.find({},function(err,adoptions){ 
         if (err){
             response.status(500).send({error:"hubo un error, no se pudieron consultar las adopciones"});
         }else {
             response.status(200).send(adoptions);
         }
     });
 });

//Find One by id
 app.get('/adoptions/:adoptionId', async function(request,response){
await Adoption.find({_id:request.params.adoptionId},function(err,adoptions){
         if (err){
             response.status(500).send({error:"hubo un error, no se pudo consultar la adopcion"});
         }else {
             response.status(200).send(adoptions);
         }
     });
 });

 //Find adoptions filtering
 app.get('/adoptions', async function(request,response){
await Adoption.find({donorId:request.query.donorId, status:request.query.status},function(err,adoptions){
         if (err){
             response.status(500).send({error:"hubo un error, no se pudo consultar la adopcion"});
         }else {
             response.status(200).send(adoptions);
         }
     });
 });


//corregir el put para que setee el receptor de la mascota
 app.put('/adoptions',async function(request,response){
await Adoption.findOne({_id:request.body.id},function(err,adoption) {
        if (err || !request.body.id || !request.body.receptorId){
            response.status(500).send({error:"no se puede encontrar la adopcion o algun parametro es invalido, entonces no se puede procesar la adopcion"+err})
        }else{
            Adoption.updateOne({_id:request.body.id},{$set:{status:request.body.status,receptorId:request.body.receptorId}}, function (err,updatedAdoption){ 
                if (err){
                    response.status(500).send({error:"No se puede procesar la Adopcion "+err});
                }else{
                    response.status(200).send(updatedAdoption);
                }
            });
        }
        }); 
    
    });

app.delete('/adoptions/:adoptionId', async function(request,response){
 await Adoption.deleteOne({_id:request.params.adoptionId}, function (err,deletedAdoption){
            if (err){
                response.status(500).send({error:"no se puede encontrar el objeto, entonces no se puede eliminar la adopcion " + err})
            } else {
            response.status(200).send(deletedAdoption);
            }
            }); 
});



