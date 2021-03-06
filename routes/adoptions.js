const router = require('express').Router();
var Adoption = require ('../models/adoption');
const verifyToken = require ('../verifytoken'); 
const petResource = require ('../resources/petResource');
const userResource = require ('../resources/userResource');

const _ = require('lodash');

router.get('/',verifyToken,async function(request,response, next){
    //Si la petición trae una query, pasamos a la siguiente ruta
    var isQuery = Object.keys(request.query).length !== 0;
    if(isQuery) {
    next();
    return;
    }

    try {
        Adoption.find({})
        .then(async (adoptions)=>{
            const tokenForRequest = {
                "auth-token": request.header('auth-token')
                };
                mergedPetswithAdoption = await petResource.getPetsWithAdoptions(tokenForRequest,adoptions,'/pets');
                mergedUserswithAdoption = await userResource.getUsersWithAdoptions(tokenForRequest,mergedPetswithAdoption,'/users');
                return response.status((!mergedUserswithAdoption || Object.keys(mergedUserswithAdoption).length === 0) ? 404 : 200).send((!mergedUserswithAdoption || Object.keys(mergedUserswithAdoption).length === 0)? error="No existe adopcion para los parametros enviados" : mergedUserswithAdoption);
        })
        .catch((error)=>{
            return response.status(500).send(error);

        });
    }
    catch(error) {
        return response.status(500).send(error);
    }
});

router.get('/',verifyToken, async function(request,response){
    try {
        if(request.query.pickupAddress) {
            var filters = {
                pickupAddress: { "$regex": request.query.pickupAddress, "$options": "i" }
            }
        }
        if(request.query.petId) {
            var filters = { 
                petId:request.query.petId,
            }
        }
        if(request.query.donorId) {
            var filters = { 
                donorId:request.query.donorId,
                status: (request.query.status)?request.query.status:""
            }
        }
        if(request.query.receptorId) {
            var filters = { 
                receptorId:request.query.receptorId,
                status: (request.query.status)?request.query.status:""
            }
        }
        for (var propName in filters) {
            if (filters[propName] === null || filters[propName] === undefined || filters[propName] === '') {
                delete filters[propName];
            }
        }
       var optionalQuery = (!{...filters}?null:{...filters});
        Adoption.find({$or:[optionalQuery]})
        .then(async (adoptions)=>{
            const tokenForRequest = {
                "auth-token": request.header('auth-token')
                };
                mergedPetswithAdoption = await petResource.getPetsWithAdoptions(tokenForRequest,adoptions,'/pets');
                mergedUserswithAdoption = await userResource.getUsersWithAdoptions(tokenForRequest,mergedPetswithAdoption,'/users');
                return response.status((!mergedUserswithAdoption || Object.keys(mergedUserswithAdoption).length === 0) ? 404 : 200).send((!mergedUserswithAdoption || Object.keys(mergedUserswithAdoption).length === 0)? error="No existe adopcion para los parametros enviados" : mergedUserswithAdoption);
        })
        .catch((error)=>{
            return response.status(400).send(error);
        });
    }
    catch(error) {
        return response.status(500).send(error);
    }
});

router.get('/:adoptionId',verifyToken, async function(request,response){
    try {
        Adoption.find({_id:request.params.adoptionId})
        .then(async (adoptions)=>{
            const tokenForRequest = {
                "auth-token": request.header('auth-token')
                };
                mergedPetswithAdoption = await petResource.getPetsWithAdoptions(tokenForRequest,adoptions,'/pets');
                mergedUserswithAdoption = await userResource.getUsersWithAdoptions(tokenForRequest,mergedPetswithAdoption,'/users');
                return response.status((!mergedUserswithAdoption || Object.keys(mergedUserswithAdoption).length === 0) ? 404 : 200).send((!mergedUserswithAdoption || Object.keys(mergedUserswithAdoption).length === 0)? error="No existe adopcion para los parametros enviados" : mergedUserswithAdoption);
        })
        .catch((error)=>{
            return response.status(500).send(error);
        });
    }
    catch(error) {
        return response.status(500).send(error);
    }
});


router.post('/',verifyToken, async function(request,response){
    try {
        const tokenForRequest = {
            "auth-token": request.header('auth-token')
        };
        //Eliminada validación de usuario para probar frontend
        /*validUser = await userResource.checkUser(tokenForRequest,request.body.donorId);
        if (!validUser) return response.status(404).send("Donante de mascota no existe");*/
        //Eliminada validación de usuario para probar frontend
        /*validPet = await petResource.checkPet(tokenForRequest,request.body.petId);
        if (!validPet) return response.status(404).send("Mascota no existe");*/
        var adoption = new Adoption(request.body); 
        await adoption.save(function(err,savedAdoption){
            if (err){
                return response.status(500).send(err);
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
        await Adoption.findOneAndUpdate({_id:request.params.adoptionId}, {
            $set: request.body
          }, {new: true}, function (err, updatedAdoption) {
            if (err) {
                return response.status(500).send(err)
            }
            return response.status((!updatedAdoption || Object.keys(updatedAdoption).length === 0) ? 404 : 200).send((!updatedAdoption || Object.keys(updatedAdoption).length === 0)? error="No existe adopcion para los parametros enviados" : updatedAdoption);
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
                return response.status(500).send(err)
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