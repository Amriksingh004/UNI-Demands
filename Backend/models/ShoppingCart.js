import mongoose from "mongoose";

const ShoppingCartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    price:{
        type:Number
    },
    quantity:{
        type:Number,
        required:true
    }
    
},{
    timestamps:true
})

const ShoppingCartModel = mongoose.model('ShoppingCart',ShoppingCartSchema)

export default ShoppingCartModel