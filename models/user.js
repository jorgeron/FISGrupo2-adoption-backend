var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    name:String,
    lastName:String,
    userName:String,
    password:String,
    email:String,
    phone:String,
    address:String,
    createdAt: { "type": Date, "default": Date.now },
    picture:String
});

//se exporta el esquema del usuario con esta sentencia. 'Mascota', es el nombre que llevara el objeto, la "tabla" se llamara 'Mascotas'
module.exports = mongoose.model('User', user);