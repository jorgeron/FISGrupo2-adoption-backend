
//importamos app para poder hacer las pruebas de los metodos http
const app = require ('../server');

//importamos libreria supertest para hacer pruebas de los metodos http
const request = require ('supertest');

//importamos la variable db con el archivo que hemos creado en database.js, donde se define la conexion a la bd 
var Adoption = require ('../models/adoption');

//importamos librerias mongoose para poder desconectar la base de datos en el afterAll()
var mongoose = require ('mongoose');

//definicion de version de la API
let BASE_API_PATH = (process.env.VERSION || '/api/v1');

//describe sirve para agrupar un conjunto de casos de prueba se estructuran siempre con llamadas de callback
//un describe general, agrupa todos los describe de cada funcionalidad a probar
describe ("Adoptions API",()=>{

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
            return request(app).get("/").then((response) =>{
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
        const testAdoptionId = "5df21a88ba4a2f11686f8284";
        let adoptions;
        //en beforeAll creamos un objeto tipo adoptions para realizar las pruebas de GET, para que tengan con que comparar la respuesta
        //asi mismo modificamos el metodo find de mongoDB para que pueda comparar el arrglo predefinido con la respuesta
        beforeAll(() => {
            adoptions = [
                {
                    "status": "cancelada",
                    "_id": "5dea19964e67b60207b4b6f4",
                    "donorId": "5de79a44f3ee18111089e77e",
                    "petId": "5de9443a34674022d87633c6",
                    "createdAt": "2019-12-06T09:04:22.355Z",
                    "updatedAt": "2019-12-12T14:56:58.397Z",
                    "__v": 0,
                    "receptorId": "5de9167ce0d42c0f000754ee"
                },
                {
                    "status": "cancelada",
                    "_id": "5df21a88ba4a2f11686f8284",
                    "donorId": "5de79a44f3ee18111089e77e",
                    "petId": "5de9443a34674022d87633c6",
                    "createdAt": "2019-12-12T10:46:32.936Z",
                    "updatedAt": "2019-12-12T10:46:32.936Z",
                    "__v": 0
                }
            ];
            
            dbFind = jest.spyOn(Adoption,"find");
         });
        
         it("Should return 200 and an array with all test adoptions (two arrays)", () => {
              dbFind.mockImplementationOnce((query,callback) => {
                callback(null,adoptions);
                
            });
            return request(app).get(BASE_API_PATH + '/adoptions').then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
                expect(dbFind).toBeCalledWith({},expect.any(Function));
            });
        });

        it("Should return 200 and one adoption array filtered by Id", () => {
            dbFind.mockImplementationOnce((query,callback) => {
              callback(null,adoptions.filter(adoption => {
                return adoption._id === testAdoptionId
              }));

          });
          return request(app).get(BASE_API_PATH + '/adoptions/'+testAdoptionId).then((response) => {
              expect(response.statusCode).toBe(200);
              expect(response.body).toBeArrayOfSize(1);
              expect(dbFind).toBeCalledWith({},expect.any(Function));
          });
      });

        it("Should return an 500 error code on database error", () => {
             dbFind.mockImplementationOnce((query,callback) => {
                callback(true,null);
            });
            return request(app).get(BASE_API_PATH + '/adoptions').then((response) => {
                expect(response.statusCode).toBe(500);
             });
        });
    });
    //FIN TESTING GET /API/V1/ADOPTIONS

//INICIO TESTING GET /API/V1/ADOPTIONS/{:adoptionId}
describe("GET /api/v1/adoptions?{donorId}&&{status}",()=>{
    const testAdoptionId = "5df21a88ba4a2f11686f8284";
    let adoptions;
    filter= {"status": "aprobada","donorId": "5de79a44f3ee18111089e77e"};
    beforeAll(() => {
        adoptions = [
            {
                "status": "aprobada",
                "_id": "5dea19964e67b60207b4b6f4",
                "donorId": "5de79a44f3ee18111089e77e",
                "petId": "5de9443a34674022d87633c6",
                "createdAt": "2019-12-06T09:04:22.355Z",
                "updatedAt": "2019-12-12T14:56:58.397Z",
                "__v": 0,
                "receptorId": "5de9167ce0d42c0f000754ee"
            },
            {
                "status": "cancelada",
                "_id": "5df21a88ba4a2f11686f8284",
                "donorId": "5de79a44f3ee18111089e77e",
                "petId": "5de9443a34674022d87633c6",
                "createdAt": "2019-12-12T10:46:32.936Z",
                "updatedAt": "2019-12-12T10:46:32.936Z",
                "__v": 0
            }
        ];     
        dbFind = jest.spyOn(Adoption,"find");
     });
    
    it("Should return 200 and one adoption array", () => {
            dbFind.mockImplementationOnce((query,callback) => {
            callback(null,adoptions.filter(adoption => {
                return (adoption.status === filter.status&&adoption.donorId===filter.donorId)
            }));

        });
        return request(app).get(BASE_API_PATH + '/adoptions').query(filter).then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.body).toBeArrayOfSize(1);
            expect(dbFind).toBeCalledWith({},expect.any(Function));
        });
    });
    
    it("Should return an 404 error code if not found on database", () => {
        filter= {"status": "Aprobada","donorId": "4de79a44f3ee18111089e77e"};
        dbFind.mockImplementationOnce((query,callback) => {
            callback(null,adoptions.filter(adoption => {
                return (adoption.status === filter.status&&adoption.donorId===filter.donorId)
            }));
       });
       return request(app).get(BASE_API_PATH + '/adoptions').query(filter).then((response) => {
           expect(response.statusCode).toBe(404);
           expect(response.body).toStrictEqual({});
           expect(dbFind).toBeCalledWith({},expect.any(Function));
        });
   });

    it("Should return an 500 error code on database error", () => {
         dbFind.mockImplementationOnce((query,callback) => {
            callback(true,null);
        });
        return request(app).get(BASE_API_PATH + '/adoptions').query(filter).then((response) => {
            //prueba en la que se define el valor que normalmente esperamos del codigo a probar
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

        return request(app).post(BASE_API_PATH + '/adoptions').send(testAdoption).then((response) => {
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
        return request(app).post(BASE_API_PATH + '/adoptions').send(testAdoption).then((response) => {
            expect(response.status).toBe(500);
        });
    });
});
//FIN TESTING POST /API/V1/ADOPTIONS

//INICIO TESTING PUT /API/V1/ADOPTIONS
describe("PUT /api/v1/adoptions/{:AdoptionId}",()=>{
    const paramId = "5df21a88ba4a2f11686f8284";
    query = {"_id":"request.params.adoptionId"};
    let testAdoptionId =  {
        "status": "disponible",
        "_id": "5df3ae2cdab15c041d311637",
        "donorId": "5de79a44f3ee18111089e77e",
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
        "_id": "5df3ae2cdab15c041d311637",
        "donorId": "5de79a44f3ee18111089e77e",
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
            return request(app).put(BASE_API_PATH + '/adoptions/'+paramId).send(newData).then((response) => {
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
            return request(app).put(BASE_API_PATH + '/adoptions/'+paramId).send(newData).then((response) => {
                expect(response.status).toBe(404);
            }); 
    
        });

    it("Should return 500 response code if there is an error in the database", () => {
        dbFindOneAndUpdate.mockImplementationOnce((query,update,options,callback) => {
            callback(true,null);
        });
        return request(app).put(BASE_API_PATH + '/adoptions/'+paramId).send(newData).then((response) => {
            expect(response.status).toBe(500);
        }); 

    });
});
//FIN TESTING PUT /API/V1/ADOPTIONS

//INICIO TESTING DELETE /API/V1/ADOPTIONS
    describe("DELETE /api/v1/adoptions/{:AdoptionId}",()=>{
        const testAdoptionId = "5df7b197e107fe0c1e1d973b";
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
            return request(app).delete(BASE_API_PATH + '/adoptions/'+testAdoptionId).then((response) => {
                expect(response.status).toBe(202);
                expect(response.body).toContainEntry(['deletedCount', 1]);
            });
        });    

        it("Should return a 404 response code if target adoption is not found", () => {
            const fakeAdoptionId = "";
            
            return request(app).delete(BASE_API_PATH + '/adoptions/'+fakeAdoptionId).then((response) => {
                expect(response.status).toBe(404);
            });
        });   

        it("Should return a 500 response code if there is an error in the database", () => {
            const testAdoptionId = "5df7b197e107fe0c1e1d973b";
            dbdeleteOne.mockImplementationOnce((query,callback) => {
                callback(true,null);
            });
            return request(app).delete(BASE_API_PATH + '/adoptions/'+testAdoptionId).then((response) => {
                expect(response.status).toBe(500);
            });
        });
        
    });
//FIN TESTING DELETE /API/V1/ADOPTIONS

});


