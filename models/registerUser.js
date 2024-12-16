import mongoose, { Schema } from "mongoose";
import crypto from "crypto";

// schema and model for registration
const registrationSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: new Date(),
  },
  firstname: {
    type: String,
    required: [true, "Please Enter Your fristName"],
  },
  lastname: {
    type: String,
    required: [true, "Please Enter Your lastName"],
  },
  companyname: {
    type: String,
    required: [true, "Please Enter Your name of company"],
  },
  phoneNo: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  category: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
  },
  website: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: "false",
  },
  role: {
    type: String,
    default: "user",
  },
  isRegister: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: String,
  resetPasswordExpire: String,
});

registrationSchema.methods.getResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return token;
};

export const register = new mongoose.model("registration", registrationSchema);