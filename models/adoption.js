var mongoose = require ('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId; // sirve para referenciar a los id de otra 'tabla' o mejor dicho coleccion

var adoption = new Schema({
    donor: {type: ObjectId,ref:'User'},
    receptor:{type: ObjectId,ref:'User'},
    pet: {type: ObjectId, ref: "Pet" },
    status: { "type": String, "default": "disponible"},
    createdAt: { "type": Date, "default": Date.now },
    startAt: Date,
    endAt: Date
});

module.exports = mongoose.model('Adoption',adoption);