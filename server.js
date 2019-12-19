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

//cargamos los modelos de la base de datos
var Adoption = require ('./models/adoption'); 

app.get('/', (req, res) => res.send("<html><body><h1>Microservicio de gestion de adopciones de mascotas Ver. 1.0</h1></body></html>"));

app.post(BASE_API_PATH + '/adoptions', async function(request,response){
    var adoption = new Adoption(request.body); 
await adoption.save(function(err,savedAdoption){
        if (err){
            return response.status(500).send({error:"hubo un error al grabar la adopcion"+err});
        }else {
            return response.status(201).send(savedAdoption);
        }
    });
});

//Find All
app.get(BASE_API_PATH + '/adoptions', async function(request,response, next){
    //Si la petición trae una query, pasamos a la siguiente ruta
    var isQuery = Object.keys(request.query).length !== 0;
    if(isQuery) {
        next();
        return;
    }
    // para buscar todos las adopciones, uso la variable del tipo objeto Adoption que en la que cargo el esquema 
    await Adoption.find({},function(err,adoptions){ 
            if (err){
                return response.status(500).send({error:"hubo un error, no se pudieron consultar las adopciones"+err});
            }else  {
                return response.status((adoptions.length===0) ? 404 : 200).send((adoptions.length===0) ? error="No existe adopcion para los parametros enviados" : adoptions);
            }
        });
    });

 //Find adoptions filtering donorId and Status
 app.get(BASE_API_PATH + '/adoptions', async function(request,response){
    try {
        await Adoption.find({$or:[{donorId:request.query.donorId, status:request.query.status}, {receptorId:request.query.receptorId, status:request.query.status}]},function(err,adoptions){
            if (err){
                return response.status(500).send({error:"hubo un error, no se pudo consultar la adopcion"+err});
            }else  {
                return response.status((adoptions.length===0) ? 404 : 200).send((adoptions.length===0) ? error="No existe adopcion para los parametros enviados" : adoptions);
            }
        });
      }
      catch(error) {
        console.error(error);
       }
     });
   
//Find One by id
 app.get(BASE_API_PATH + '/adoptions/:adoptionId', async function(request,response){
    try {
        await Adoption.find({_id:request.params.adoptionId},function(err,adoption){
            if (err){
                return response.status(500).send({error:"hubo un error, no se pudo consultar la adopcion"+err});
            }else  {
                 return response.status((adoption.length===0) ? 404 : 200).send((adoption.length===0) ? error="No existe adopcion para los parametros enviados" : adoption);
            }
        });
      }
      catch(error) {
        console.error(error);
      }
  });

/*
//corregir el put para que setee el receptor de la mascota
app.put(BASE_API_PATH + '/adoptions/:adoptionId', async (request,response) => {
try {  
    await Adoption.findOne({_id:request.params.adoptionId},function(err,adoption){
        if (err){
            return response.status(500).send({error:"hubo un error, no se pudo encontrar la adopcion a modificar: "+err});
        }else  {
            if (!adoption) return response.status(404).send({error:"hubo un error, no se pudo encontrar la adopcion a modificar: "+err});
            if (adoption.length===0){
                return response.status(404).send({error:"hubo un error, no se pudo encontrar la adopcion a modificar: "+err});
            } else {             
                try {
                    adoption.status=request.body.status
                    adoption.receptorId=request.body.receptorId
                    adoption.save(function(err,updatedAdoption){
                        if (err){
                            return response.status(500).send({error:"hubo un error al modificiar la adopcion: "+err});
                        }else {
                            return response.status(200).send(updatedAdoption);
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

app.put(BASE_API_PATH + '/adoptions/:adoptionId',async function(request,response){
    try{
        await Adoption.findOneAndUpdate({_id:request.params.adoptionId}, {$set:{status:request.body.status,receptorId:request.body.receptorId}}, {new: true}, function (err, updatedAdoption) {
            if (err) {
                return response.status(500).send({error:"no se puede encontrar el objeto, entonces no se puede eliminar la adopcion " + err})
            }
            if (!updatedAdoption) return response.status(404).send({error:"hubo un error, no se pudo encontrar la adopcion a modificar: "+err}); 
            return response.status((updatedAdoption.length===0) ? 404 : 200).send((updatedAdoption.length===0) ? error="No existe adopcion para los parametros enviados" : updatedAdoption);
        });
    }
    catch(error) {
    console.error(error);
    }
});
    


app.delete(BASE_API_PATH + '/adoptions/:adoptionId', async function(request,response){

    try {
          await Adoption.deleteOne({_id:request.params.adoptionId}, function (err,deletedAdoption){
                if (err){
                    return response.status(500).send({error:"no se puede encontrar el objeto, entonces no se puede eliminar la adopcion " + err})
                } else {
                    return response.status((deletedAdoption.deletedCount===0)? 404: 202).send(deletedAdoption);
                }
                });
   }
      catch(error) {
        console.error(error);
      }  
});


// exportamos este módulo para poder usar la variable app fuera de este archivo
module.exports = app;