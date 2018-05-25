const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ComenziSchema = new Schema({
    produs:{
        type: String,
        required: true
    },
    tel:{
        type: String,
        required: true
    },
    nume:{
        type: String
    },
    data:{
        type: Date,
        default :Date.now
    }
}); 

mongoose.model('comenzi', ComenziSchema);