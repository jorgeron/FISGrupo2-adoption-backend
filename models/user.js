var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    userName: {
        type: String,
        required: true
    },
    password:{
        type:String
    },
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String
    },
    phone:{
        type: String
    },
    photoUrl:{
        type: String
    },
    address:{
        type: String
    }
},
{
    timestamps: true,
});

module.exports = mongoose.model('User',user);
