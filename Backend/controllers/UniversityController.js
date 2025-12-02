import UniversityModel from "../models/University.js"
import fs from 'fs'

export const GetUniversities = async (req,res)=>{
    try {
        const uniData = await UniversityModel.find()
    
        if(uniData) res.status(200).send({uniData});
        else res.status(404).send({message:"Data not Found"})
    } catch (error) {
        console.log(error)    
    }
}


export const CreateUniversity = async (req,res) =>{
    try {
        const uniData = await UniversityModel.create({
            name: req.body.name,
            image: req?.file?.filename
        })
        if(uniData) res.status(201).send({message:"University created successfully"});
        else res.status(404).send({message: "Something went wrong"})

    } catch (error) {
        console.log(error);
    }
}

export const UpdateUniversity = async (req,res)=>{
    try {

        const uniInDb = await UniversityModel.findById(req.body.id)

        if(!uniInDb){
            res.status(404).send({message:"University not found"})
            return
        }
        if(req?.file?.filename){
            if(fs.existsSync(`./public/universityImg/${uniInDb.image}`)){
                fs.unlinkSync(`./public/universityImg/${uniInDb.image}`)
            }
        }
        const uniData = await UniversityModel.findByIdAndUpdate(req.body.id,{
            name: req.body.name,
            image: req?.file?.filename
        })

        if(uniData) res.status(200).send({message:"University updated successfully"});
        else res.status(404).send({message: "Something went wrong"})

    } catch (error) {
        console.log(error);
        
    }
}

export const DeleteUniversity = async (req,res)=>{
    try {
        
        const uniInDb = await UniversityModel.findById(req.params.id)
        if(fs.existsSync(`./public/universityImg/${uniInDb.image}`)){
            fs.unlinkSync(`./public/universityImg/${uniInDb.image}`)
            
        }
        const uniData = await UniversityModel.findByIdAndDelete(req.params.id)
        if(uniData) res.status(200).send({message:"University deleted successfully"});
        else res.status(404).send({message: "Something went wrong"});
        // else res.status(404).send(un)
    } catch (error) {
        console.log(error);
    }
}