//importamos app para poder hacer las pruebas de los metodos http
const app = require ('../server');
//importamos libreria supertest para hacer pruebas de los metodos http
const request = require ('supertest');

//importamos la variable db con el archivo que hemos creado en database.js, donde se define la conexion a la bd 
var Adoption = require ('../models/adoption');

//importamos librerias mongoose para poder desconectar la base de datos en el afterAll()
var mongoose = require ('mongoose');

//describe sirve para agrupar un conjunto de casos de prueba se estructuran siempre con llamadas de callback
//un describe general, agrupa todos los describe de cada funcionalidad a probar
describe ("Adoptions API",()=>{
//cierra la conexion a la base de datos una vez que se terminan las pruebas 
    afterAll(async () => {
        try {
          // Connection to Mongo killed.
          await mongoose.disconnect();
        } catch (error) {
          console.log(`Error en la desconexion de MongoDB durante el test! ${error}`);
          throw error;
        }
    });

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

    describe("GET /api/v1/adoptions",()=>{
        //creamos un objeto tipo adoptions para realizar las pruebas de GET, para que tengan con que comparar la respuesta
        //asi mismo modificamos el metodo find de mongoDB para que pueda comparar el arrglo predefinido con la respuesta
        beforeAll(() => {
            const adoptions = [
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
            dbFind.mockImplementation((query,callback) => {
                callback(null,adoptions);
            });
        });

        it("Should return all adoptions", () => {

        });
    });
});


