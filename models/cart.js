const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    cid:{
        type:String,
        required:true 
    },
    pid:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model('cartdata',cartSchema);