
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
        
         it("Should return all adoptions", () => {
              dbFind.mockImplementationOnce((query,callback) => {
                callback(null,adoptions);
            });
            return request(app).get(BASE_API_PATH + '/adoptions').then((response) => {
                //prueba en la que se define el valor que normalmente esperamos del codigo a probar
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
                expect(dbFind).toBeCalledWith({},expect.any(Function));
            });
        });

        it("Should return an 500 error code on database error", () => {
             dbFind.mockImplementationOnce((query,callback) => {
                callback(true,null);
            });
            return request(app).get(BASE_API_PATH + '/adoptions').then((response) => {
                //prueba en la que se define el valor que normalmente esperamos del codigo a probar
                expect(response.statusCode).toBe(500);
             });
        });
    });
    //FIN TESTING GET /API/V1/ADOPTIONS




    //INICIO TESTING POST /API/V1/ADOPTIONS
    describe("POST /api/v1/adoptions",()=>{
        let dbSave;
        dbSave = jest.spyOn(Adoption.prototype,"save");
        const testAdoption =                
            {
            "status": "cancelada",
            "_id": "5dea19964e67b60207b4b6f4",
            "donorId": "5de79a44f3ee18111089e77e",
            "petId": "5de9443a34674022d87633c6",
            "createdAt": "2019-12-06T09:04:22.355Z",
            "updatedAt": "2019-12-12T14:56:58.397Z",
            "__v": 0,
            "receptorId": "5de9167ce0d42c0f000754ee"
        };

        it("Should add new adoption if everything is OK", () => {
            dbSave.mockImplementationOnce((callback) => {
                callback(null,savedAdoption = new Adoption(testAdoption));
            });

            return request(app).post(BASE_API_PATH + '/adoptions').send(testAdoption).then((response) => {
                expect(response.status).toBe(201);
                expect(dbSave).toBeCalledWith(expect.any(Function));
                expect(response.body).toMatchObject(testAdoption);
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

    describe("PUT /api/v1/adoptions",()=>{
        
    });

});


