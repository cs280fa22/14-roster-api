import mongoose from "mongoose";
import { z } from "zod";
import { UserRole } from "./UserRole.js";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true,
    default: UserRole.Student,
  },
});

UserSchema.path("email").validate((input) => {
  try {
    z.string().email().parse(input);
    return true;
  } catch (err) {
    return false;
  }
}, "Invalid Email");

const User = mongoose.model("User", UserSchema);

export default User;
