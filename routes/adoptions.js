const router = require('express').Router();
var Adoption = require ('../models/adoption');
const verifyToken = require ('../verifytoken'); 
const petResource = require ('../resources/petResource')
const _ = require('lodash');

router.get('/',verifyToken,async function(request,response, next){
    try {
        //Si la petición trae una query, pasamos a la siguiente ruta
        var isQuery = Object.keys(request.query).length !== 0;
        if(isQuery) {
        next();
        return;
        }
        //request.user contiene los datos del usuario del token luego de verificarlo
        //console.log(request.user);
        // para buscar todos las adopciones, uso la variable del tipo objeto Adoption que en la que cargo el esquema 

        // COMENTADO POR PRUEBA DE INTEGRACION
        await Adoption.find({},function(err,adoptions){ 
        if (err){
        return response.status(500).send({error:"hubo un error, no se pudieron consultar las adopciones"+err});
        }else {
        //return response.status((adoptions.length===0) ? 404 : 200).send((adoptions.length===0) ? error="No existe adopcion para los parametros enviados" : adoptions);
           if (adoptions.length===0) {
            return response.status(404).send(error="No existe adopcion para los parametros enviados");
           }
           else {
            const tokenForRequest = {
                "auth-token": request.header('auth-token')
            }
            const pathToFetch = '/pets';
            petResource.getPetsWithAdoptions(tokenForRequest,adoptions,pathToFetch)
            .then((mergedPetswithAdoption)=>{                
            response.status(200).send(mergedPetswithAdoption);

              /*var merged = _.map(allPets, function(pet) {
                    return _.assign(pet, _.find(adoptions, ['petId', pet._id]));
                });
               response.status(200).send(merged);
              */  
              
            })
            .catch((error)=>{
                console.log(error)
                response.status(500).send(error);
            });
             }
    }
        });
    }
    catch(error) {
        console.error(error);
    }
});

router.get('/',verifyToken, async function(request,response){
    try {
        await Adoption.find({$or:[{petId:request.query.petId},{status:request.query.status,$or:[{donorId:request.query.donorId}, {receptorId:request.query.receptorId}]}]},function(err,adoptions){ 
        if (err){
        return response.status(500).send({error:"hubo un error, no se pudieron consultar las adopciones"+err});
        }else {
        return response.status((adoptions.length===0) ? 404 : 200).send((adoptions.length===0) ? error="No existe adopcion para los parametros enviados" : adoptions);
        }
        });
    }
    catch(error) {
        console.error(error);
    }
});

router.get('/:adoptionId',verifyToken, async function(request,response){
    try {
        await Adoption.find({_id:request.params.adoptionId},function(err,adoption){
            if (err){
                return response.status(500).send({error:"hubo un error, no se pudo consultar la adopcion"+err});
            }
            else {
                return response.status((adoption.length===0) ? 404 : 200).send((adoption.length===0) ? error="No existe adopcion para los parametros enviados" : adoption);
            }
        });
    }
    catch(error) {
        console.error(error);
    }
});


router.post('/',verifyToken, async function(request,response){
    try {
        var adoption = new Adoption(request.body); 
        await adoption.save(function(err,savedAdoption){
            if (err){
                return response.status(500).send({error:"hubo un error al grabar la adopcion"+err});
            }
            else {
                return response.status(201).send(savedAdoption);
            }
        });
    }
    catch(error) {
        console.error(error);
    }
});

router.put('/:adoptionId',verifyToken, async function(request,response){
    try {
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

router.delete('/:adoptionId',verifyToken, async function(request,response){
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




module.exports = router;