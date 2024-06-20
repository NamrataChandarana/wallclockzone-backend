import { Router } from 'express'
import {
  getallnewusers,
  getAllUser,
  getSingleUser,
  deleteUser,
  getApprovedUsers,
  updateUserStatus,
} from "../controllers/adminController.js";
import { isAuthenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/auth.js";

const router = Router();

//getallusers
router.get(
    "/newusers",
    isAuthenticate,
    authorizeRoles("admin"),
    getallnewusers
);

//getapprovedusers
router.get("/all", isAuthenticate, authorizeRoles("admin"), getAllUser);

router.get(
    "/approved",
    isAuthenticate,
    authorizeRoles("admin"),
    getApprovedUsers
);

//singleUser, updateUse, deleteUser
router
  .route("/:id")
  .get(isAuthenticate, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticate, authorizeRoles("admin"), updateUserStatus)
  .delete(isAuthenticate, authorizeRoles("admin"), deleteUser)


//New-Features
  
// router.post("/edit-category/:id",isAuthenticate, authorizeRoles("admin"), editCategory)
// router.delete("/delete-category/:id",isAuthenticate, authorizeRoles("admin"), deleteCategory);
// router.post("/add-category", isAuthenticate, authorizeRoles("admin"), addCategory)
//change role 
// router.put(
//   "/admin/status/update",
//   isAuthenticate,
//   authorizeRoles("admin"),
//   updateUserStatus
// );

export default router;