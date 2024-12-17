import mongoose from "mongoose";
import { register } from "./registerUser.js";
import { Chat } from "./chatModel.js";

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'senderModel'  },
    senderModel: {
      type: String,
      required: true,
      enum: ['registration', 'user'] // Allowed models
    },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref:"Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "registration" }],
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
