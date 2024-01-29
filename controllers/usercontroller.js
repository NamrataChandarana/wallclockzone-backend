import { register } from "../models/user.js";
// import { Conversations } from "../models/conversations.js";
// import { Messages } from "../models/messages.js";
import bycrypt from "bcryptjs";
import { sendcookie } from "../utils/features.js";
import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { errorHandler } from "../middleware/error.js";
import jwt from "jsonwebtoken";
import { Apifeature } from "../utils/apifeature.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { isAuthenticate } from "../middleware/auth.js";
import { promiseHooks } from "v8";
import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";

// registration
export const userRegister = catchAsyncError(async (req, res, next) => {
  const {
    firstname,
    lastname,
    companyname,
    phoneNo,
    username,
    password,
    category,
    city,
    state,
    address,
    email,
    website,
  } = req.body;

  let user = await register.findOne({ email });

  if (user) return next(new errorHandler("User already exists", 409));

  let checkNum = await register.findOne({ phoneNo });

  if (checkNum) return next(new errorHandler("User already exists", 409));

  const hashpwd = await bycrypt.hash(password, 10);

  user = await register.create({
    firstname,
    lastname,
    companyname,
    phoneNo,
    username,
    password: hashpwd,
    category,
    city,
    state,
    address,
    email,
    website,
  });

  sendcookie(user, res, 201, "Register successfully");
});

// login
export const userLogin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  let user = await register.findOne({ email }).select("+password");
  console.log(user);

  if (!user) next(new errorHandler("Invalid Email or Password ", 400));

  const isMatch = await bycrypt.compare(password, user.password);

  if (!isMatch) next(new errorHandler("Invalid Email or Password ", 400));

  // console.log(user._id);
  sendcookie(user, res, 200, `welcome back, ${user.firstname}`);
});

// get profile
export const myProfile = catchAsyncError((req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// logout
export const logout = catchAsyncError((req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
      success: true,
      user: req.user,
    });
});

// Get all users(admin)
export const getAllUser = catchAsyncError(async (req, res, next) => {
  const users = await register.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//  get all unapprove user --admin
export const getallnewusers = catchAsyncError(async (req, res, next) => {
  const user = await register.find({ status: "false" });

  res.json({
    success: "ture",
    user,
  });
});

// Get single user (admin)
export const getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await register.findById(req.params.id);

  if (!user) {
    return next(
      new errorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Delete User --Admin
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await register.findById(req.params.id);
  console.log(req.params.id);
  console.log(user);

  if (!user)
    return next(
      new errorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

// approveUser by admin  --admin
export const updateUserStatus = catchAsyncError(async (req, res, next) => {
  const user = await register.findById(req.params.id);
  console.log(req.params.id);
  console.log(user);

  if (!user)
    return next(
      new errorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );

  if (user.status == false) {
    user.status = "true";
  } else {
    user.status = "false";
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "status updated",
  });
});

//2. all approved user
export const getApprovedUsers = catchAsyncError(async (req, res, next) => {
  const user = await register.find({ status: "true" });

  res.json({
    success: "ture",
    user,
  });
});

//update profile
export const updateUserProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    companyname: req.body.companyname,
    phoneNo: req.body.phoneNo,
    username: req.body.username,
    category: req.body.category,
    city: req.body.city,
    state: req.body.state,
    address: req.body.address,
    email: req.body.email,
    website: req.body.website,
  };

  const user = await register.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "updated Successfully",
    user,
  });
});

// get all user --search side
export const getUsers = catchAsyncError(async (req, res, next) => {
  const apifeature = new Apifeature(
    register.find({ status: "true" }),
    req.query
  )
    .search()
    .filter();
  const user = await apifeature.query;

  res.json({
    success: "ture",
    user,
  });
});

//forgatePassword
export const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await register.findOne({ email });
  if (!user) res.status(400).send("User not found");
  // console.log(user);

  //generate Token
  const resetToken = await user.getResetToken();
  await user.save();
  // console.log(resetToken);

  const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  console.log(url);

  const msg = `Click on link to reset password. ${url}.`;

  //send token in mail
  sendEmail(user.email, msg, "wall Clock Zone ResetPassword");

  res
    .status(200)
    .json({ success: true, msg: `Reset token has send to ${user.email}` });
});

//resetPassword
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  console.log(token);

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  // console.log(resetPasswordToken);
  const user = await register.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  console.log(user);
  if (!user) return next(new errorHandler("Invalid token or it is expired"));

  const hashpwd = await bycrypt.hash(req.body.password, 10);

  // let passwordsMatch = await bycrypt.compare(hashpwd, user.password);
  // console.log(passwordsMatch);

  // if (hashpwd === user.password) {
  //   return next(new errorHandler("you can't set password same as old one"));
  // }

  //change pwd

  user.password = hashpwd;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();
  res.status(200).json({ success: true, msg: `Reset Password` });
});

//store converstation
// export const conversations = catchAsyncError(async (req, res) => {
//   const { senderId, receiverId } = req.body;
//   const newConversation = new Conversations({
//     members: [senderId, receiverId],
//   });
//   await newConversation.save();
//   res.status(200).send("Conversation created successfully");
// });

//get conversations
// export const getConversations = catchAsyncError(async (req, res) => {
//   const userId = req.params.userId;
//   console.log(userId);
//   const conversations = await Conversations.find({
//     members: { $in: [userId] },
//   });
//   console.log(conversations);
//   const conversationUserData = Promise.all(
//     conversations.map(async (conversation) => {
//       const receiverId = conversation.members.find(
//         (member) => member !== userId
//       );
//       console.log("id", receiverId);
//       const user = await register.findById(receiverId);
//       return {
//         user: { email: user.email, fullName: user.fullname },
//         conversationId: conversation._id,
//       };
//     })
//   );
//   res.status(200).json(await conversationUserData);
// });

// //store msg
// export const messages = catchAsyncError(async (req, res) => {
//   const { conversationId, senderId, message } = req.body;
//   if (!senderId || !message)
//     return res.status(400).send("please fill all required fields");
//   if (!conversationId && receiverId) {
//     const newConversation = new Conversations({
//       members: [senderId, receiverId],
//     });
//     await newConversation.save();
//     const newMessage = new Messages({
//       conversationId: newConversation._id,
//       senderId,
//       message,
//     });
//     await newMessage.save();
//     res.status(200).send("Message sent successfully");
//   } else if (!conversationId && !receiverId) {
//     return res.status(400).send("please fill all required fields");
//   }
//   const newMessage = new Messages({ conversationId, senderId, message });
//   await newMessage.save();
//   res.status(200).send("Message sent successfully");
// });

//get msg
// export const getMessages = catchAsyncError(async (req, res) => {
//   const conversationId = req.params.conversationId;
//   if (conversationId === "new") return res.status(200).json([]);
//   const messages = await Messages.find({ conversationId });
//   const messageUserData = Promise.all(
//     messages.map(async (message) => {
//       const user = await register.findById(message.senderId);
//       return {
//         user: { email: user.email, fullName: user.fullName },
//         message: message.message,
//       };
//     })
//   );

//   res.status(200).json(await messageUserData);
// });

//

export const accessChat = catchAsyncError(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  // console.log(req.user);
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    // .populate("users", "-password")
    .populate("latestMessage");

  console.log(isChat);
  console.log(register);
  isChat = await register.populate(isChat, {
    path: "latestMessage.sender",
    // select: "firstname email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//getchat
export const fetchChats = catchAsyncError(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      // .populate("users", "-password")
      // .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await register.populate(results, {
          path: "latestMessage.sender",
          select: "firstname email",
        });
        console.log(results);
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
