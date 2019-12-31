
//adicion de variable que controla la base de datos de ambiente de testing
const dbConnect = require('../database');

//importamos app para poder hacer las pruebas de los metodos http
const app = require ('../server');

//importamos variables de entorno
const dotenv = require('dotenv');
dotenv.config();

//importacion de libreria jwt
const jwt = require('jsonwebtoken');

//importamos libreria supertest para hacer pruebas de los metodos http
const request = require ('supertest');

//importamos la variable db con el archivo que hemos creado en database.js, donde se define la conexion a la bd 
const Adoption = require ('../models/adoption');

//importamos librerias mongoose para poder desconectar la base de datos en el afterAll()
const mongoose = require ('mongoose');

//definicion de version de la API
const BASE_API_PATH = (process.env.VERSION || '/api/v1');

//definicion de token dummy de prueba
const token = '1';

const petResource = require ('../resources/petResource');
const userResource = require ('../resources/userResource');

const adoptions = [
    {
        "status": "disponible",
        "_id": "5df3ae2cdab15c041d311637",
        "donorId": "5dfd1e4d659f084487f4449a",
        "petId": "5dfa1741596e441834e04624",
        "pickupAddres": "San Juan",
        "createdAt": "2019-12-13T15:28:44.472Z",
        "updatedAt": "2019-12-22T16:43:15.380Z",
        "__v": 0,
        "receptorId": "5dfd1e26659f084487f44499"
    },
    {
        "status": "procesando",
        "_id": "5df757413ae05d083c83d6a3",
        "donorId": "5dfd1e26659f084487f44499",
        "petId": "5dfa174a596e441834e04625",
        "pickupAddres": "San Juan",
        "createdAt": "2019-12-16T10:06:57.109Z",
        "updatedAt": "2019-12-16T11:04:19.794Z",
        "__v": 0,
        "receptorId": "5dfd1e4d659f084487f4449a"
    }
];
mergedAdoptions=[{
    "adoptionId": "5df3ae2cdab15c041d311637",
    "status": "disponible",
    "donorId": "5dfd1e4d659f084487f4449a",
    "PetOwnerId": "5dfd1e4d659f084487f4449a",
    "pickupAddres": "San Juan",
    "userDonorId": "5dfd1e4d659f084487f4449a",
    "donorName": "JonUser5",
    "donorEmail": "jonuser5@alum.us.es",
    "donorAddress": "ciudad expo",
    "receptorId": "5dfd1e26659f084487f44499",
    "userReceptorId": "5dfd1e26659f084487f44499",
    "receptorName": "JonUser4",
    "receptorEmail": "jonuser4@alum.us.es",
    "receptorAddress": "ciudad expo",
    "petId": "5dfa1741596e441834e04624",
    "petName": "Kitty",
    "petSize": "grande",
    "petNotes": "alergico",
    "imgUrl": "https://gatosygatitos.net/wp-content/uploads/2012/03/url1.jpg",
    "petCreatedAt": "2019-12-18T12:10:41.851Z",
    "petUpdatedAt": "2019-12-18T12:10:41.851Z"
},
{
    "adoptionId": "5df757413ae05d083c83d6a3",
    "status": "procesando",
    "donorId": "5dfd1e26659f084487f44499",
    "PetOwnerId": "5dfd1e26659f084487f44499",
    "pickupAddres": "San Juan",
    "userDonorId": "5dfd1e26659f084487f44499",
    "donorName": "JonUser4",
    "donorEmail": "jonuser4@alum.us.es",
    "donorAddress": "ciudad expo",
    "receptorId": "5dfd1e4d659f084487f4449a",
    "userReceptorId": "5dfd1e4d659f084487f4449a",
    "receptorName": "JonUser5",
    "receptorEmail": "jonuser5@alum.us.es",
    "receptorAddress": "ciudad expo",
    "petId": "5dfa174a596e441834e04625",
    "petName": "Lilly",
    "petSize": "grande",
    "petNotes": "alergico",
    "imgUrl": "https://gatosygatitos.net/wp-content/uploads/2012/03/url1.jpg",
    "petCreatedAt": "2019-12-18T12:10:50.388Z",
    "petUpdatedAt": "2019-12-18T12:10:50.388Z"
}];

//describe sirve para agrupar un conjunto de casos de prueba se estructuran siempre con llamadas de callback
//un describe general, agrupa todos los describe de cada funcionalidad a probar
describe ("Adoptions API",()=>{
    beforeAll(() => {
        
        verifyCheckUser=jest.spyOn(userResource,"checkUser");
        verifyCheckUser.mockImplementation((token,path)=>{
            return true;
        });

        verifyCheckPet=jest.spyOn(petResource,"checkPet");
        verifyCheckPet.mockImplementation((token,path)=>{
            return true;
        });

        authVerify=jest.spyOn(jwt,"verify");
        authorizedUSer={
            "_id": "5dfd1e4d659f084487f4449a",
            "userName": "JonUser5",
            "email": "jonuser5@alum.us.es",
            "iat": 1576874287
        };
        authVerify.mockImplementation((tokenToTest,TOKEN_SECRET,callback)=>{
            callback(null,authorizedUSer);
        });
        

        //Indicamos mediante el parámetro que trabajamos sobre la BD de testing
        return dbConnect(integrationTesting = true);
    });
//En afterALL se cierra la conexion a la base de datos una vez que se terminan las pruebas 
    afterAll(async () => {
        try {
          // Connection to Mongo killed.
          await mongoose.disconnect();
        } catch (error) {
          console.log(`Error en la desconexion de MongoDB durante el test! ${error}`);
          throw error;
        }
    });
    //INICIO TESTING GET /
    //describe correspondiente al GET de la raiz, debe devolver un <HTML><H1> con el titulo de la API 
    describe("GET /",() => {
    //se describe cada "caso de prueba" dentro del callback de la funcion it,
        it("Should return an HTML document", () => {
        //codigo que se va a testear
            return request(app).get(BASE_API_PATH+"/").then((response) =>{
                //prueba en la que se define el valor que normalmente esperamos del codigo a probar
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining("html"));
                expect(response.text).toEqual(expect.stringContaining("h1"));
            });
        });
    });
    //FIN TESTING GET /

    //INICIO TESTING GET /API/V1/ADOPTIONS
    describe("GET /api/v1/adoptions",()=>{
        const testAdoptionId = "5df3ae2cdab15c041d311637";
        //en beforeAll creamos un objeto tipo adoptions para realizar las pruebas de GET, para que tengan con que comparar la respuesta
        //asi mismo modificamos el metodo find de mongoDB para que pueda comparar el arrglo predefinido con la respuesta
        beforeAll(() => {
            
            dbFind = jest.spyOn(Adoption,"find");
            getPetsWithAdoptions = jest.spyOn(petResource, "getPetsWithAdoptions");
            getUsersWithAdoptions= jest.spyOn(userResource,"getUsersWithAdoptions");

         });
        
         it("Should return 200 and an array with all test adoptions (two arrays)", () => {

            getPetsWithAdoptions.mockImplementationOnce((token,array,path)=>{
                return(mergedAdoptions);
            });
            getUsersWithAdoptions.mockImplementationOnce((token,array,path)=>{
                return(mergedAdoptions);
            });

            return request(app).get(BASE_API_PATH + '/adoptions').set('auth-token',token).then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
            });
        });

        it("Should return 200 and one adoption array filtered by Id", () => {
            
            getPetsWithAdoptions.mockImplementationOnce((token,array,path)=>{
                return(mergedAdoptions.filter(mergedAdoption =>{
                    return mergedAdoption.adoptionId === testAdoptionId
                }));
            });
            getUsersWithAdoptions.mockImplementationOnce((token,array,path)=>{
                return(mergedAdoptions.filter(mergedAdoption =>{
                    return mergedAdoption.adoptionId === testAdoptionId
                }));
            });

          return request(app).get(BASE_API_PATH + '/adoptions/'+testAdoptionId).set('auth-token',token).then((response) => {
              expect(response.statusCode).toBe(200);
              expect(response.body).toBeArrayOfSize(1);
          });
      });

        it("Should return an 500 error code on database error", () => {
             dbFind.mockImplementationOnce((query) => {
                return(true)
            });
            return request(app).get(BASE_API_PATH + '/adoptions').set('auth-token',token).then((response) => {
                expect(response.statusCode).toBe(500);
             });
        });
    });
    //FIN TESTING GET /API/V1/ADOPTIONS

//INICIO TESTING "GET /api/v1/adoptions?{donorId}&&{status}
describe("GET /api/v1/adoptions?{donorId}&&{status}||{petId}",()=>{
    const testAdoptionId = "5df757413ae05d083c83d6a3";
    const testPetId = "5dfa174a596e441834e04625"
    let filter= {"status": "procesando","donorId": "5dfd1e26659f084487f44499","_id":"5df757413ae05d083c83d6a3test","pickupAddres": "San Juan",};

    beforeAll(() => {
        dbFind = jest.spyOn(Adoption,"find");
     });
    
    it("Should return status code 200 and matching array", () => {
       
        getPetsWithAdoptions.mockImplementationOnce((token,array,path)=>{
            return(mergedAdoptions.filter(mergedAdoption =>{
                return mergedAdoption.adoptionId === testAdoptionId
            }));
        });
        getUsersWithAdoptions.mockImplementationOnce((token,array,path)=>{
            return(mergedAdoptions.filter(mergedAdoption =>{
                return mergedAdoption.adoptionId === testAdoptionId
            }));
        });

        return request(app).get(BASE_API_PATH + '/adoptions').query(filter).set('auth-token',token).then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeArrayOfSize(1);
          
        });
    });
    
    it("Should return an 404", () => {
        filter= {"petId": "5dfa174a596e441834e04622","pickupAddres": "San Juan",};

        getPetsWithAdoptions.mockImplementationOnce((token,array,path)=>{
            return(mergedAdoptions.filter(mergedAdoption =>{
                return mergedAdoption.petId === filter.petId
            }));
        });
        getUsersWithAdoptions.mockImplementationOnce((token,array,path)=>{
            return({});
        });
       return request(app).get(BASE_API_PATH + '/adoptions').query(filter).set('auth-token',token).then((response) => {
           expect(response.statusCode).toBe(404);
           //expect(response.body).toStrictEqual({});
          
        });
   });

    it("Should return an 500 error code on database error", () => {
             dbFind.mockImplementationOnce((query) => {
                return(true)
            });
            return request(app).get(BASE_API_PATH + '/adoptions').query(filter).set('auth-token',token).then((response) => {
                expect(response.statusCode).toBe(500);
             });
    });
});
//FIN TESTING GET /API/V1/ADOPTIONS/{:adoptionId}


//INICIO TESTING POST /API/V1/ADOPTIONS
describe("POST /api/v1/adoptions",()=>{
    let dbSave;
    dbSave = jest.spyOn(Adoption.prototype,"save");
    const testAdoption =                
        {
        "status": "procesando",
        "donorId": "5de79a44f3ee18111089e77e",
        "pickupAddres": "San Juan",
        "petId": "5de9443a34674022d87633c6",
        "createdAt": "2019-12-06T09:04:22.355Z",
        "updatedAt": "2019-12-12T14:56:58.397Z",
        "__v": 0,
        "receptorId": "5de9167ce0d42c0f000754ee"
    };

    it("Should return 200 and new added adoption if everything is OK", () => {
        dbSave.mockImplementationOnce((callback) => {
            callback(null,savedAdoption = testAdoption);
        });

        return request(app).post(BASE_API_PATH + '/adoptions').send(testAdoption).set('auth-token',token).then((response) => {
            expect(response.status).toBe(201);
            expect(dbSave).toBeCalledWith(expect.any(Function));
            expect(response.body).toBeObject();
            expect(response.body).toContainEntry(['donorId', '5de79a44f3ee18111089e77e']);
            expect(response.body).toContainEntry(['petId', '5de9443a34674022d87633c6']);
            expect(response.body).toContainEntry(['status', 'procesando']);
        }); 

    });

    it("Should return a 500 response code if there is a problem with the database", () => {
        dbSave.mockImplementationOnce((callback) => {
            callback(true,null);
        });
        return request(app).post(BASE_API_PATH + '/adoptions').send(testAdoption).set('auth-token',token).then((response) => {
            expect(response.status).toBe(500);
        });
    });
});
//FIN TESTING POST /API/V1/ADOPTIONS

//INICIO TESTING PUT /API/V1/ADOPTIONS
describe("PUT /api/v1/adoptions/{:AdoptionId}",()=>{
    const paramId = "5df8abeab9b0da2310e82e37";
    query = {"_id":"request.params.adoptionId"};
    let testAdoptionId =  {
        "status": "disponible",
        "_id": "5df8abeab9b0da2310e82e37",
        "donorId": "5de79a44f3ee18111089e77e",
        "pickupAddres": "San Juan",
        "petId": "5de9443a34674022d87633c6",
        "createdAt": "2019-12-13T15:28:44.472Z",
        "updatedAt": "2019-12-17T09:38:49.126Z",
        "__v": 0
    };
    const newData ={
        "status": "procesando",
        "receptorId": "5de79a44f3ee18111089e77e"
    }
    updatedAdoption =  {
        "status": "procesando",
        "_id": "5df8abeab9b0da2310e82e37",
        "donorId": "5de79a44f3ee18111089e77e",
        "pickupAddres": "San Juan de Aznalfarache",
        "petId": "5de9443a34674022d87633c6",
        "createdAt": "2019-12-13T15:28:44.472Z",
        "updatedAt": "2019-12-17T09:38:49.126Z",
        "receptorId": "5de79a44f3ee18111089e77e",
        "__v": 0
    };
    
        dbFindOneAndUpdate = jest.spyOn(Adoption,"findOneAndUpdate");

        it("Should return 200 response code and updated Adoption if everything is OK", () => {
            dbFindOneAndUpdate.mockImplementationOnce((query,update,options,callback) => {
                callback(null,updatedAdoption);
            });
            return request(app).put(BASE_API_PATH + '/adoptions/'+paramId).send(newData).set('auth-token',token).then((response) => {
                expect(response.status).toBe(200);
                expect(response.body).toBeObject();
                expect(response.body).toContainKey("_id");
                expect(response.body).toContainEntry(['status', newData.status]);
            }); 
    
        });

        it("Should return 404 response code if there is an error in the database", () => {
            dbFindOneAndUpdate.mockImplementationOnce((query,update,options,callback) => {
                callback(null,null);
            });
            return request(app).put(BASE_API_PATH + '/adoptions/'+paramId).send(newData).set('auth-token',token).then((response) => {
                expect(response.status).toBe(404);
            }); 
    
        });

    it("Should return 500 response code if there is an error in the database", () => {
        dbFindOneAndUpdate.mockImplementationOnce((query,update,options,callback) => {
            callback(true,null);
        });
        return request(app).put(BASE_API_PATH + '/adoptions/'+paramId).send(newData).set('auth-token',token).then((response) => {
            expect(response.status).toBe(500);
        }); 

    });
});
//FIN TESTING PUT /API/V1/ADOPTIONS

//INICIO TESTING DELETE /API/V1/ADOPTIONS
    describe("DELETE /api/v1/adoptions/{:AdoptionId}",()=>{
        const testAdoptionId = "5df8abeab9b0da2310e82e37";
        dbdeleteOne = jest.spyOn(Adoption,"deleteOne");


        it("Should return a 202 response code if everything is OK", () => {
            dbdeleteOne.mockImplementationOnce((query,callback) => {
                callback(false,deleteResult={
                    "n": 1,
                    "opTime": {
                        "ts": "6770633608450277377",
                        "t": 2
                    },
                    "electionId": "7fffffff0000000000000002",
                    "ok": 1,
                    "operationTime": "6770633608450277377",
                    "$clusterTime": {
                        "clusterTime": "6770633608450277377",
                        "signature": {
                            "hash": "xbXPG/buO5sAqPkHLPVnHNM9wQ8=",
                            "keyId": "6764753214106501121"
                        }
                    },
                    "deletedCount": 1
                });
            });
            return request(app).delete(BASE_API_PATH + '/adoptions/'+testAdoptionId).set('auth-token',token).then((response) => {
                expect(response.status).toBe(202);
                expect(response.body).toContainEntry(['deletedCount', 1]);
            });
        });    

        it("Should return a 404 response code if target adoption is not found", () => {
            const fakeAdoptionId = "";
            
            return request(app).delete(BASE_API_PATH + '/adoptions/'+fakeAdoptionId).set('auth-token',token).then((response) => {
                expect(response.status).toBe(404);
            });
        });   

        it("Should return a 500 response code if there is an error in the database", () => {
            const testAdoptionId = "5df7b197e107fe0c1e1d973b";
            dbdeleteOne.mockImplementationOnce((query,callback) => {
                callback(true,null);
            });
            return request(app).delete(BASE_API_PATH + '/adoptions/'+testAdoptionId).set('auth-token',token).then((response) => {
                expect(response.status).toBe(500);
            });
        });
        
    });
//FIN TESTING DELETE /API/V1/ADOPTIONS

});


