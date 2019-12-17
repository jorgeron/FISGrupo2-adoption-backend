const Adoption = require('../models/adoption');
const mongoose = require('mongoose');
const dbConnect = require('../database');

describe('Adoptions DB connection', () => {
    //Antes de todas las pruebas, nos conectamos a la BD
    beforeAll(() => {
        //Indicamos mediante el parámetro que trabajamos sobre la BD de testing
        return dbConnect(integrationTesting = true);
    })

    //Antes de cada prueba hay que poner la BD en un estado conocido
    //Una solución es borrar la BD
    beforeEach((done) => {
        Adoption.deleteMany({}, (err) => {
            done();
        });
    })

    //Probamos a guardar ua nueva adopción y comprobamos que se ha guardado.
    it('writes an adoption in the DB', (done) => {
        //Arrange
        const adoptionTest = new Adoption({
            "donorId" : "5de79a44f3ee18111089testing",
            "petId": "5de9443a34674022d876testing",
            "status": "disponible"
        });
        //Act
        adoptionTest.save((err, adoption) => {
            //Assert
            expect(err).toBeNull();
            Adoption.find({}, (err, adoptions) => {
                expect(adoptions).toBeArrayOfSize(1);
                done();
            });
        });

    });


    //Por último, cerramos la conexión con la BD
    afterAll((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
        });
    });
})