import mongoose from "mongoose";

const UniversitySchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    image:{
        type: String,
        required:true
    },
},
{
    timestamps: true
})

const UniversityModel = mongoose.model("University", UniversitySchema);

export default UniversityModel;