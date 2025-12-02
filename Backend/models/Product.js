import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  department:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  images:{
    type:[String],
    required: true
  },
  active: {
    type: Boolean,
    default: true,
  },
  quantity:{
    type: Number,
    required: true,
  },
},
{timestamps:true}
);

const ProductModel = mongoose.model("Product", ProductSchema);

export default ProductModel;