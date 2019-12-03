var mongoose = require ('mongoose');
var Usuarios = mongoose.model('Usuarios');
var Mascotas = mongoose.model('Mascotas');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId; // sirve para referenciar a los id de otra 'tabla' o mejor dicho coleccion

var adopciones = new Schema({
    donorId : { type: ObjectId, ref: "Usuarios" },
    receptorId: { type: ObjectId, ref: "Usuarios" },
    petId: { type: ObjectId, ref: "Mascotas" },
    status: String,
    startedAt: Date,
    endedAt: Date,
});

module.exports = mongoose.model('Adopciones',adopciones);