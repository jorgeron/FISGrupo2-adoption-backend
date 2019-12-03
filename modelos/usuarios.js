var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var usuario = new Schema({
    name:String,
    lastName:String,
    userName:String,
    password:String,
    email:String,
    phone:String,
    address:String,
    createdAt: Date,
    picture:String
});

//se exporta el esquema del producto con esta sentencia. 'Mascota', es el nombre que llevara el objeto, la "tabla" se llamara 'Mascotas'
module.exports = mongoose.model('Usuario', usuario);