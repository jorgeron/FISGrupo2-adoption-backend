//cargamos base de datos
var db = require('./database.js');

// Cargamos los módulos de express y body-parser
var express = require('express');
var bodyParser = require('body-parser');

//versionado de al API
var BASE_API_PATH = (process.env.VERSION || '/api/v1');

// Llamamos a express para poder crear el servidor
var app = express();

//aplicamos el cors y body-parser al objeto app
app.use(bodyParser.json());

//agregamos verificacion de token
const verifyToken = require ('./verifytoken'); 

//cargamos los modelos de la base de datos
var Pet = require ('./models/pet'); 

app.get('/', (req, res) => res.send("<html><body><h1>Microservicio de gestion de mascotas Ver. 1.0</h1></body></html>"));

app.post(BASE_API_PATH + '/pets',verifyToken, async function(request,response){
    var pet = new Pet(request.body); 
await pet.save(function(err,savedPet){
        if (err){
            return response.status(500).send({error:"hubo un error al grabar la adopcion"+err});
        }else {
            return response.status(201).send(savedPet);
        }
    });
});


//Find All
app.get(BASE_API_PATH + '/pets',verifyToken, async function(request,response, next){
    //Si la petición trae una query, pasamos a la siguiente ruta
    var isQuery = Object.keys(request.query).length !== 0;
    if(isQuery) {
        next();
        return;
    }
    // para buscar todos las mascotas, uso la variable del tipo objeto Pet que en la que cargo el esquema 
    await Pet.find({},function(err,Pets){ 
            if (err){
                return response.status(500).send({error:"hubo un error, no se pudieron consultar las mascotas"+err});
            }else  {
                return response.status((Pets.length===0) ? 404 : 200).send((Pets.length===0) ? error="No existe mascota para los parametros enviados" : Pets);
            }
        });
    });

 /*   
 //Find Pets filtering donorId and Status
 app.get(BASE_API_PATH + '/pets', async function(request,response){
    try {
        await Pet.find({_Id:request.query.PetId},function(err,Pets){
            if (err){
                return response.status(500).send({error:"hubo un error, no se pudo consultar la mascota"+err});
            }else  {
                return response.status((Pets.length===0) ? 404 : 200).send((Pets.length===0) ? error="No existe mascota para los parametros enviados" : Pets);
            }
        });
      }
      catch(error) {
        console.error(error);
       }
     });
*/   
//Find One by id
 app.get(BASE_API_PATH + '/pets/:PetId', verifyToken, async function(request,response){
    try {
        await Pet.find({_id:request.params.PetId},function(err,Pet){
            if (err){
                return response.status(500).send({error:"hubo un error, no se pudo consultar la mascota"+err});
            }else  {
                 return response.status((Pet.length===0) ? 404 : 200).send((Pet.length===0) ? error="No existe mascota para los parametros enviados" : Pet);
            }
        });
      }
      catch(error) {
        console.error(error);
      }
  });

/*
//corregir el put para que setee el receptor de la mascota
app.put(BASE_API_PATH + '/pets/:PetId', async (request,response) => {
try {  
    await Pet.findOne({_id:request.params.PetId},function(err,Pet){
        if (err){
            return response.status(500).send({error:"hubo un error, no se pudo encontrar la mascota a modificar: "+err});
        }else  {
            if (!Pet) return response.status(404).send({error:"hubo un error, no se pudo encontrar la mascota a modificar: "+err});
            if (Pet.length===0){
                return response.status(404).send({error:"hubo un error, no se pudo encontrar la mascota a modificar: "+err});
            } else {             
                try {
                    Pet.status=request.body.status
                    Pet.receptorId=request.body.receptorId
                    Pet.save(function(err,updatedPet){
                        if (err){
                            return response.status(500).send({error:"hubo un error al modificiar la mascota: "+err});
                        }else {
                            return response.status(200).send(updatedPet);
                        }
                    });
                }
                catch(error){
                    console.error(error);
                }
            }
        }
    });
}
catch(error) {
    console.error(error);
  }
});
*/
/*
app.put(BASE_API_PATH + '/pets/:PetId',async function(request,response){
    try{
        await Pet.findOneAndUpdate({_id:request.params.PetId}, {$set:{status:request.body.status,receptorId:request.body.receptorId}}, {new: true}, function (err, updatedPet) {
            if (err) {
                return response.status(500).send({error:"no se puede encontrar el objeto, entonces no se puede eliminar la mascota " + err})
            }
            if (!updatedPet) return response.status(404).send({error:"hubo un error, no se pudo encontrar la mascota a modificar: "+err}); 
            return response.status((updatedPet.length===0) ? 404 : 200).send((updatedPet.length===0) ? error="No existe mascota para los parametros enviados" : updatedPet);
        });
    }
    catch(error) {
    console.error(error);
    }
});
 */   


app.delete(BASE_API_PATH + '/pets/:PetId',verifyToken, async function(request,response){

    try {
          await Pet.deleteOne({_id:request.params.PetId}, function (err,deletedPet){
                if (err){
                    return response.status(500).send({error:"no se puede encontrar el objeto, entonces no se puede eliminar la mascota " + err})
                } else {
                    return response.status((deletedPet.deletedCount===0)? 404: 202).send(deletedPet);
                }
                });
   }
      catch(error) {
        console.error(error);
      }  
});



// exportamos este módulo para poder usar la variable app fuera de este archivo
module.exports = app;