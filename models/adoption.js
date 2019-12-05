var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var adoption = new Schema({
    donorId: {
        type: String,
        required: true
    },
    receptorId:{
        type: String
    },
    petId: {
        type: String,
        required:true
    },
    status: { 
        type: String, 
        enum : ['Disponible','En Proceso','Aceptada','Cancelada'],
        default: 'Disponible'
    },
    },{
    timestamps: true,
});

module.exports = mongoose.model('Adoption',adoption);
