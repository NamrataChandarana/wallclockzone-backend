import mongoose from "mongoose";
import { register } from "./registerUser.js";
import { Message } from "./messageModel.js";

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId,   required: true, refPath: 'senderModel'}],
    senderModel: {
        type: String,
        required: true,
        enum: ['registration', 'user'] // Allowed models
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatModel);
