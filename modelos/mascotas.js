var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var mascota = new Schema({
    name:String,
    specie: Number,
    
    breed:String,
    sex: String,
    size:String,
    picture:String
});

//se exporta el esquema del producto con esta sentencia. 'Mascota', es el nombre que llevara el objeto, la "tabla" se llamara 'Mascotas'
module.exports = mongoose.model('Mascota', mascota);