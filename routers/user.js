import express from "express";
import {
  userLogin,
  userRegister,
  myProfile,
  logout,
  updateUserProfile,
  getUsers,
  forgetPassword,
  resetPassword,
  userSignin,
  UserProfileUpdate
} from "../controllers/usercontroller.js";
import { isAuthenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/new", userRegister);
router.post("/login", userLogin);
router.post("/signin", userSignin);
router.get("/me", isAuthenticate, myProfile);
router.get("/logout", logout);
//Register user
router.put("/me/update", isAuthenticate, updateUserProfile);
//Non Register user
router.put("/me/edit", isAuthenticate, UserProfileUpdate);
router.post("/forgetPassword", forgetPassword);
router.put("/resetPassword/:token", resetPassword);
router.get("/allusers", getUsers);


export default router;

// search by category and filter by city and state
