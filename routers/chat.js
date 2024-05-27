import { Router } from 'express'
import {
    accessChat,
    fetchChats,
    searchUser,
    allMessages,
    sendMessage
  } from "../controllers/usercontroller.js";
import { isAuthenticate } from "../middleware/auth.js";

const router = Router();

router.route("/chat").post(isAuthenticate, accessChat);
router.route("/getchat").get(isAuthenticate, fetchChats);
router.route("/searchUser").get(isAuthenticate, searchUser);
router.route("/getMsg/:chatId").get(isAuthenticate, allMessages);
router.route("/sendMsg").post(isAuthenticate, sendMessage);

export default router;