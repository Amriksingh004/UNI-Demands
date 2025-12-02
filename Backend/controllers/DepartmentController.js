import DepartmentModel from "../models/Department.js";
import fs from 'fs'

export const GetDepartments = async (req, res) => {
  try {
    const deptData = await DepartmentModel.find({
      university: req.params.id,
    }).populate("university");
    if (deptData) res.status(200).send(deptData);
    else res.status(404).send({ message: "Data not Found" });
  } catch (error) {
    console.log(error);
  }
};

export const SaveDepartment = async (req, res) => {
  try {
    const deptData = await DepartmentModel.create({
      name: req.body.name,
      image: req?.file?.filename,
      university: req.body.universityId,
    });
    if (deptData)
      res.status(201).send({ message: "Department created successfully" });
    else res.status(404).send({ message: "Something went wrong" });
  } catch (er) {
    console.log(er);
  }
};

export const UpdateDepartment = async (req, res) => {
  try {
    const deptInDb = await DepartmentModel.findById(req.body.id);
    if (!deptInDb) {
      res.status(404).send({ message: "Department not found" });
      return;
    }
    if (req?.file?.filename) {
      if (fs.existsSync(`public/departmentImg/${deptInDb.image}`)) {
        fs.unlinkSync(`public/departmentImg/${deptInDb.image}`);
      }
    }
    const deptData = await DepartmentModel.findByIdAndUpdate(req.body.id, {
      name: req.body.name,
      image: req?.file?.filename,
    });
    if (deptData)
      res.status(200).send({ message: "Department updated successfully" });
    else res.status(404).send({ message: "Something went wrong" });
  } catch (error) {
    console.log(error);
  }
};

export const DeleteDepartment = async (req, res) => {
  try {
    const deptInDb = await DepartmentModel.findById(req.params.id);
    if (fs.existsSync(`public/departmentImg/${deptInDb.image}`)) {
      fs.unlinkSync(`public/departmentImg/${deptInDb.image}`);
    }
    const deptData = await DepartmentModel.findByIdAndDelete(req.params.id);
    if (deptData)
      res.status(200).send({ message: "Department deleted successfully" });
    else res.status(404).send({ message: "Something went wrong" });
  } catch (error) {
    console.log(error);
  }
};
