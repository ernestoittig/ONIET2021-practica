const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type: String,
        required:true,
    },
    surname:{
        type: String,
        required:true,
    },
    email:{
        type: String,
        required:true,
        unique:true,
    },
    password:{
        type: String,
        required:true,
    },
    country:{
        type: Schema.Types.ObjectId,
        ref: 'Country',
        required:true,
    },
    lastAccess:{
        type: Date,
        required: true,
        default: new Date(),
    }
},{toJSON:{virtuals:true}});

module.exports = mongoose.model('User',userSchema);
