import mongoose, { mongo } from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  profilePic: {
    type: String,

  },
},
{
    timestamps: true,

});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;