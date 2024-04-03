import mongoose from "mongoose";
import { register } from "./user.js";
import { Chat } from "./chatModel.js";

// const messageSchema = mongoose.Schema({
//   conversationId: {
//     type: String,
//   },
//   senderId: {
//     type: String,
//   },
//   message: {
//     type: String,
//   },
// });

// export const Messages = mongoose.model("Messages", messageSchema);

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref:register },
    content: { type: String, trim: true },
    chats: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: register }],
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
