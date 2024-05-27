import express from "express";
import {
  userLogin,
  userRegister,
  myProfile,
  logout,
  getallnewusers,
  getAllUser,
  getSingleUser,
  deleteUser,
  getApprovedUsers,
  updateUserStatus,
  updateUserProfile,
  getUsers,
  forgetPassword,
  resetPassword,
} from "../controllers/userController.js";
import { isAuthenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/new", userRegister);
router.post("/login", userLogin);
router.get("/me", isAuthenticate, myProfile);
router.get("/logout", logout);
router.put("/me/update", updateUserProfile);
router.post("/forgetPassword", forgetPassword);
router.put("/resetPassword/:token", resetPassword);

//chat
// router.route("/chat").post(isAuthenticate, accessChat);
// router.route("/getchat").get(isAuthenticate, fetchChats);
// router.route("/searchUser").get(isAuthenticate, searchUser);
// router.route("/getMsg/:chatId").get(isAuthenticate, allMessages);
// router.route("/sendMsg").post(isAuthenticate, sendMessage);

// admin router
router.get(
  "/admin/newusers",
  isAuthenticate,
  authorizeRoles("admin"),
  getallnewusers
);
router.get("/allusers", getUsers);
router.get("/admin/all", isAuthenticate, authorizeRoles("admin"), getAllUser);
router.get(
  "/admin/approved",
  isAuthenticate,
  authorizeRoles("admin"),
  getApprovedUsers
);
// router.put(
//   "/admin/status/update",
//   isAuthenticate,
//   authorizeRoles("admin"),
//   updateUserStatus
// );

router
  .route("/admin/:id")
  .get(isAuthenticate, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticate, authorizeRoles("admin"), updateUserStatus)
  .delete(isAuthenticate, authorizeRoles("admin"), deleteUser);

export default router;

// search by category and filter by city and state
