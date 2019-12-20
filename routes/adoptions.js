const router = require('express').Router();
var Adoption = require ('../models/adoption'); 

router.route('/').get(async function(request,response, next){
    try {
        //Si la petición trae una query, pasamos a la siguiente ruta
        var isQuery = Object.keys(request.query).length !== 0;
        if(isQuery) {
        next();
        return;
        }
        // para buscar todos las adopciones, uso la variable del tipo objeto Adoption que en la que cargo el esquema 
        await Adoption.find({},function(err,adoptions){ 
        if (err){
        return response.status(500).json({error:"hubo un error, no se pudieron consultar las adopciones"+err});
        }else {
        return response.status((adoptions.length===0) ? 404 : 200).send((adoptions.length===0) ? error="No existe adopcion para los parametros enviados" : adoptions);
        }
        });
    }
    catch(error) {
        console.error(error);
    }
});

router.route('/').get(async function(request,response){
    try {
        await Adoption.find({status:request.query.status,$or:[{donorId:request.query.donorId}, {receptorId:request.query.receptorId}]},function(err,adoptions){ 
        if (err){
        return response.status(500).json({error:"hubo un error, no se pudieron consultar las adopciones"+err});
        }else {
        return response.status((adoptions.length===0) ? 404 : 200).send((adoptions.length===0) ? error="No existe adopcion para los parametros enviados" : adoptions);
        }
        });
    }
    catch(error) {
        console.error(error);
    }
});

router.route('/:adoptionId').get(async function(request,response){
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


router.route('/').post(async function(request,response){
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

router.route('/:adoptionId').put(async function(request,response){
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

router.route('/:adoptionId').delete(async function(request,response){
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