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
var User = require ('./models/user'); 

app.get('/', (req, res) => res.send("<html><body><h1>Microservicio de gestion de usuarios Ver. 1.0</h1></body></html>"));

app.post(BASE_API_PATH + '/Users', async function(request,response){
    var user = new User(request.body); 
await user.save(function(err,savedUser){
        if (err){
            return response.status(500).send({error:"hubo un error al grabar el usuario"+err});
        }else {
            return response.status(201).send(savedUser);
        }
    });
});


//Find All
app.get(BASE_API_PATH + '/users', async function(request,response, next){
    //Si la Userición trae una query, pasamos a la siguiente ruta
    var isQuery = Object.keys(request.query).length !== 0;
    if(isQuery) {
        next();
        return;
    }
    // para buscar todos los usuarios, uso la variable del tipo objeto User que en la que cargo el esquema 
    await User.find({},function(err,Users){ 
            if (err){
                return response.status(500).send({error:"hubo un error, no se pudieron consultar los usuarios"+err});
            }else  {
                return response.status((Users.length===0) ? 404 : 200).send((Users.length===0) ? error="No existe usuario para los parametros enviados" : Users);
            }
        });
    });

 /*   
 //Find Users filtering donorId and Status
 app.get(BASE_API_PATH + '/Users', async function(request,response){
    try {
        await User.find({_Id:request.query.UserId},function(err,Users){
            if (err){
                return response.status(500).send({error:"hubo un error, no se pudo consultar el usuario"+err});
            }else  {
                return response.status((Users.length===0) ? 404 : 200).send((Users.length===0) ? error="No existe usuario para los parametros enviados" : Users);
            }
        });
      }
      catch(error) {
        console.error(error);
       }
     });
*/   
//Find One by id
 app.get(BASE_API_PATH + '/users/:UserId', async function(request,response){
    try {
        await User.find({_id:request.params.UserId},function(err,User){
            if (err){
                return response.status(500).send({error:"hubo un error, no se pudo consultar el usuario"+err});
            }else  {
                 return response.status((User.length===0) ? 404 : 200).send((User.length===0) ? error="No existe usuario para los parametros enviados" : User);
            }
        });
      }
      catch(error) {
        console.error(error);
      }
  });

/*
//corregir el put para que setee el receptor de el usuario
app.put(BASE_API_PATH + '/Users/:UserId', async (request,response) => {
try {  
    await User.findOne({_id:request.params.UserId},function(err,User){
        if (err){
            return response.status(500).send({error:"hubo un error, no se pudo encontrar el usuario a modificar: "+err});
        }else  {
            if (!User) return response.status(404).send({error:"hubo un error, no se pudo encontrar el usuario a modificar: "+err});
            if (User.length===0){
                return response.status(404).send({error:"hubo un error, no se pudo encontrar el usuario a modificar: "+err});
            } else {             
                try {
                    User.status=request.body.status
                    User.receptorId=request.body.receptorId
                    User.save(function(err,updatedUser){
                        if (err){
                            return response.status(500).send({error:"hubo un error al modificiar el usuario: "+err});
                        }else {
                            return response.status(200).send(updatedUser);
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
app.put(BASE_API_PATH + '/Users/:UserId',async function(request,response){
    try{
        await User.findOneAndUpdate({_id:request.params.UserId}, {$set:{status:request.body.status,receptorId:request.body.receptorId}}, {new: true}, function (err, updatedUser) {
            if (err) {
                return response.status(500).send({error:"no se puede encontrar el objeto, entonces no se puede eliminar el usuario " + err})
            }
            if (!updatedUser) return response.status(404).send({error:"hubo un error, no se pudo encontrar el usuario a modificar: "+err}); 
            return response.status((updatedUser.length===0) ? 404 : 200).send((updatedUser.length===0) ? error="No existe usuario para los parametros enviados" : updatedUser);
        });
    }
    catch(error) {
    console.error(error);
    }
});
 */   


app.delete(BASE_API_PATH + '/users/:UserId', async function(request,response){

    try {
          await User.deleteOne({_id:request.params.UserId}, function (err,deletedUser){
                if (err){
                    return response.status(500).send({error:"no se puede encontrar el objeto, entonces no se puede eliminar el usuario " + err})
                } else {
                    return response.status((deletedUser.deletedCount===0)? 404: 202).send(deletedUser);
                }
                });
   }
      catch(error) {
        console.error(error);
      }  
});



// exportamos este módulo para poder usar la variable app fuera de este archivo
module.exports = app;