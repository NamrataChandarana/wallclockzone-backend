import jwt from "jsonwebtoken";
import { register } from "../models/user.js";
import { errorHandler } from "./error.js";

export const isAuthenticate = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    res.json({
      success: false,
      message: "Not logged in",
    });
    return;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await register.findById(decoded._id);
  next();
};

//authorization

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorHandler(
          `Role: ${req.user.role} is not allowed to access this Recources`,
          403
        )
      );
    }
    next();
  };
};
