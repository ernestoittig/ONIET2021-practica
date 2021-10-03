const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const countrySchema = new Schema({
    countryCode:{
        type: String,
        required: true,
        unique:true
    },
    countryName:{
        type: String,
        required: true,
    }
},{timestamps:true});

module.exports = mongoose.model('Country', countrySchema);
