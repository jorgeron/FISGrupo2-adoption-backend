var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var pet = new Schema({
    petName: {
        type: String,
        required: true
    },
    OwnerId:{
        type: String,
        required:true
    },
    petSpecie:{
        type:String
    },
    petGender:{
        type:String
    },
    petSize:{
        type:String
    },
    petNotes:{
        type:String
    },
    imgUrl:{
        type: String
    }
},
{
    timestamps: true,
});

module.exports = mongoose.model('Pet',pet);
