const mongoose   = require('mongoose')

const itemSchema = new mongoose.Schema({
    brand:{
        type:String,
        required:true
    },
    itemName:{
     type:String,
     required:true
    },
    color:{
        type:String,
        required:true
    },
    desc:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    pic1:{
        type:String,
        required:true       
    },
    pic2:{
        type:String,
        required:true       
    },
    pic3:{
        type:String,
        required:true       
    },
    category:{
        type:String,
        required:true
    },
    dealerId:{
        type:mongoose.Types.ObjectId,
        required:true
    }
});

module.exports = mongoose.model('item',itemSchema);