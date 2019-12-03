var mongoose = require ('mongoose');
var db = mongoose.connect('mongodb://localhost/adoptamascota', {useNewUrlParser: true, useUnifiedTopology: true }); //hay que conectar la base de datos para trabajar con mongodb


//HAY QUE CREAR LOS MODELOS DE LOS OBJETOS QUE SE VAN A USAR CONTRA LA BASE DE DATOS, SE EMPIEZA DE ABAJO HACIA ARRIBA, POR EJEMPLO: productos y luego wishlist (que tiene productos)
var Usuario = require ('./modelos/usuarios'); //crea un objeto tipo usuarios basado en el modelo descrito en usuarios.js
var Mascota = require ('./modelos/mascotas'); //crea un objeto tipo mascotas basado en el schema del modelo descrito en masctoas.js
var Adopcion = require ('./modelos/adopciones'); //crea un objeto tipo adopciones basado en el schema del modelo descrito en adopciones.js
 