var mongoose = require ('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId; // sirve para referenciar a los id de otra 'tabla' o mejor dicho coleccion

var adopcion = new Schema({
    donorId : { type: ObjectId, ref: "Usuario" },
    receptorId: { type: ObjectId, ref: "Usuario" },
    petId: { type: ObjectId, ref: "Mascota" },
    status: { "type": String, "default": "available"},
    createdAt: { "type": Date, "default": Date.now },
    startAt: Date,
    endAt: Date,
});

module.exports = mongoose.model('Adopcion',adopcion);