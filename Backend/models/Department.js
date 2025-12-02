import mongoose from "mongoose";
const DepartmentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    university:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"University",
        required:true
    },
    image:{
        type:String,
        required:true
    }
})

const DepartmentModel = mongoose.model("Department",DepartmentSchema)

export default DepartmentModel;