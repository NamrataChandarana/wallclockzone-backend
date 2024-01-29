import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "register" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "register" }],
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);

// import mongoose, { Schema } from "mongoose";

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
