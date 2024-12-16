import jwt from "jsonwebtoken";
import { register } from "../models/registerUser.js";
import { errorHandler } from "./error.js";
import { user } from "../models/user.js";

export const isAuthenticate = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(200).json({
      success: false,
      message: "Not logged in",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await register.findById(decoded._id) || await user.findById(decoded._id);

    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    next();
  }catch(error){
    console.error("Error during authentication: ", error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }

};

//authorization
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorHandler(
          `Role: User does not have permission`,
          403
        )
      );
    }
    next();
  };
};
