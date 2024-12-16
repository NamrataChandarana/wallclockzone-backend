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
  userSignin
} from "../controllers/usercontroller.js";
import { isAuthenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/new", userRegister);
router.post("/login", userLogin);
router.post("/signin", userSignin);
router.get("/me", isAuthenticate, myProfile);
router.get("/logout", logout);
router.put("/me/update", isAuthenticate, updateUserProfile);
router.post("/forgetPassword", forgetPassword);
router.put("/resetPassword/:token", resetPassword);
router.get("/allusers", getUsers);


export default router;

// search by category and filter by city and state
