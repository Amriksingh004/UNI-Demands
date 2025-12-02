import jsonwebtoken from "jsonwebtoken";
import UserModel from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;

export const Register = async (req, res) => {
  try {
    let userInDb = await UserModel.findOne({ email: req.body.email });
    if (userInDb) {
      res.status(404).send({ message: "User already exists" });
      return;
    }
    const userData = await UserModel.create({
      ...req.body,
      profilePic: req?.file?.filename,
    });
    if (userData) {
      const token = jsonwebtoken.sign(
        { id: userData._id, role: userData.role, email: userData.email , phone: userData.phone},
        secret
      );
      userData.password = undefined;
      res
        .status(201)
        .send({ userData, token, message: "User created successfully" });
    } else {
      res.status(404).send({ message: "Something went wrong" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const userInDb = await UserModel.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (!userInDb) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    const token = jsonwebtoken.sign(
      { id: userInDb._id, role: userInDb.role, email: userInDb.email , phone: userInDb.phone},
      secret
    );
    userInDb.password = undefined;
    res
      .status(200)
      .send({ userInDb, token, message: "User logged in successfully" });
  } catch (error) {
    console.log(error);
  }
};
