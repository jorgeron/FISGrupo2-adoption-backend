//importamos app para poder hacer las pruebas de los metodos http
const app = require ('../server');
//importamos libreria supertest para hacer pruebas de los metodos http
const request = require ('supertest');

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
            request(app).get("/").then((response) =>{
                expect(response.status).toBe(200);
                expect(response.type).toEqual(expect.stringContaining("html"));
                expect(response.text).toEqual(expect.stringContaining("h1"));
                
            });
         //prueba en la que se define el valor que normalmente esperamos del codigo a probar

        });
    });

});


