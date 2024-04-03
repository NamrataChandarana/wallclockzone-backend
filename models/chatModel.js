// const mongoose = require("mongoose");
import mongoose from "mongoose";
import { register } from "./user.js";
import { Message } from "./messageModel.js";

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: register }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Message,
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatModel);


// const conversationSchema = mongoose.Schema({
//   members: {
//     type: Array,
//     required: true,
//   },
// });

// export const Conversations = mongoose.model(
//   "Conversations",
//   conversationSchema
// );
