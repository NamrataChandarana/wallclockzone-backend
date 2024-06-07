import { register } from "../models/user.js";
import bycrypt from "bcryptjs";
import { sendcookie } from "../utils/features.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { errorHandler } from "../middleware/error.js";
import { Apifeature } from "../utils/apifeature.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { loginInput, registrationInput } from "../utils/inputValidation.js";

// registration
export const userRegister = catchAsyncError(async (req, res, next) => {

  const {success, error} = registrationInput.safeParse(req.body);
  console.log(success, error.message)
  if (!success) {
    const errorMessage = error.errors.map(err => `${err.path.join('.')} : ${err.message}`).join(', ');
    return next(new errorHandler(`Invalid Inputs: ${errorMessage}`, 400));
  }
  const {
    firstname,//1
    lastname,//2
    companyname,
    phoneNo,//3
    username,//4
    password,//5
    category,
    city,
    state,
    address, //street
    email,//6
    website,
  } = (req.body);
  

  let user = await register.findOne({ email });

  if (user) return next(new errorHandler("User already exists", 409));

  let checkNum = await register.findOne({ phoneNo });

  if (checkNum) return next(new errorHandler("User already exists", 409));

  const hashpwd = await bycrypt.hash(password, 10);

  user = await register.create({
    firstname,
    lastname,
    companyname,
    phoneNo,
    username,
    password: hashpwd,
    category,
    city,
    state,
    address,
    email,
    website,
  });

  sendcookie(user, res, 201, "Register successfully");

});

// login
export const userLogin = catchAsyncError(async (req, res, next) => {

  const {success} = loginInput.safeParse(req.body);
  if(!success) return next(new errorHandler("Invlaid Inputs",400));

  const { email, password } = req.body;

  let user = await register.findOne({ email }).select("+password");

  if (!user) return next(new errorHandler("Invalid Email or Password ", 400));

  const isMatch = await bycrypt.compare(password, user.password);

  if (!isMatch) return next(new errorHandler("Invalid Email or Password ", 400));

  // console.log(user._id);
  sendcookie(user, res, 200, `welcome back, ${user.firstname}`);
});

// get profile
export const myProfile = catchAsyncError((req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// logout
export const logout = catchAsyncError((req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
      success: true,
      user: req.user,
    });
});

//update profile
export const updateUserProfile = catchAsyncError(async (req, res, next) => {
  console.log(req.user)
  const newUserData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    companyname: req.body.companyname,
    phoneNo: req.body.phoneNo,
    username: req.body.username,
    category: req.body.category,
    city: req.body.city,
    state: req.body.state,
    address: req.body.address,
    email: req.body.email,
    website: req.body.website,
  };

  const user = await register.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "updated Successfully",
    user,
  });
});

// get all user --search side
export const getUsers = catchAsyncError(async (req, res, next) => {
  const apifeature = new Apifeature(
    register.find({ status: "true" }),
    req.query
  )
    .search();
    // .filter();
  const user = await apifeature.query;

  res.json({
    success: "ture",
    user,
  });
});

//forgatePassword
export const forgetPassword = catchAsyncError(async (req, res,next) => {
  const { email } = req.body;
  const user = await register.findOne({ email });
  if (!user) res.status(400).send("User not found");
  // console.log(user);

  //generate Token
  const resetToken = await user.getResetToken();
  await user.save();
  // console.log(resetToken);

  const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  console.log(url);

  const msg = `Click on link to reset password. ${url}.`;

  //send token in mail
  sendEmail(user.email, msg, "wall Clock Zone ResetPassword");

  res
    .status(200)
    .json({ success: true, msg: `Reset token has send to ${user.email}` });
});

//resetPassword
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  console.log(token);

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  // console.log(resetPasswordToken);
  const user = await register.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  console.log(user);
  if (!user) return next(new errorHandler("Invalid token or it is expired"));

  const hashpwd = await bycrypt.hash(req.body.password, 10);

  // let passwordsMatch = await bycrypt.compare(hashpwd, user.password);
  // console.log(passwordsMatch);

  // if (hashpwd === user.password) {
  //   return next(new errorHandler("you can't set password same as old one"));
  // }

  //change pwd

  user.password = hashpwd;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();
  res.status(200).json({ success: true, msg: `Reset Password` });
});



//admin
// Get all users(admin)
export const getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await register.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//  get all unapprove user --admin
export const getallnewusers = catchAsyncError(async (req, res, next) => {
  const user = await register.find({ status: "false" });

  res.json({
    success: "ture",
    user,
  });
});

// Get single user (admin)
export const getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await register.findById(req.params.id);

  if (!user) {
    return next(
      new errorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Delete User --Admin
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await register.findById(req.params.id);

  if (!user)
    return next(
      new errorHandler(`User does not exist with Id: ${req.params.id}`, 400)
  );

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

// approveUser by admin  --admin
export const updateUserStatus = catchAsyncError(async (req, res, next) => {
  const user = await register.findById(req.params.id);
  console.log(req.params.id);
  console.log(user);

  if (!user)
    return next(
      new errorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );

  if (user.status == false) {
    user.status = "true";
  } else {
    user.status = "false";
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "status updated",
  });
});

//2. all approved user admin
export const getApprovedUsers = catchAsyncError(async (req, res, next) => {
  const user = await register.find({ status: "true" });

  res.json({
    success: "ture",
    user,
  });
});




