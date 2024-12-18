import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Chat } from "../models/chatModel.js";
import { register } from "../models/registerUser.js";
import { Message } from "../models/messageModel.js";
import { user } from "../models/user.js";

// chat

export const searchUser = catchAsyncError(async (req, res, next) => {
    const keyword = req.query.search ? {
      $or: [
        {companyname: {$regex: req.query.search, $options: "i"}},
        {email: {$regex: req.query.search, $options: "i"}}
      ],
    } : null;
  
    console.log(keyword)
    
    if (!keyword) return next(new errorHandler("Please Enter Something ", 400));
  
    const users = await register.find(keyword).find({_id: {$ne: req.user._id}});
    console.log(users)
    
    res.status(200).json({
      success: true,
      users
    })
    // res.send(users);
})
  
export const accessChat = catchAsyncError(async (req, res) => {

  const { userId } = req.body;
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { userId: req.user._id.toString() } } },
      { users: { $elemMatch: { userId: userId } } },
    ],
  }).populate({
    path: "users.userId",
    select: "-password",
  })
  .populate("latestMessage");

  isChat = await Chat.populate(isChat, {
    path: "latestMessage.sender",
    select: "firstname email companyname name",
  });

  if (isChat.length > 0) {
    return res.send(isChat[0]);
  } else {

    const registerSender = await register.find({_id: req.user._id});
    const sender = await user.find({_id: req.user._id});
    const reciever = await user.find({_id: userId});
    const registerReciever = await register.find({_id:userId});

    let userModel;
    if(registerSender && reciever){
      userModel = [{userId: req.user._id, senderModel: "registration"}, {userId: userId, senderModel: "user"}]
    }else if(registerSender && registerReciever){
      userModel = [{userId: req.user._id, senderModel: "registration"}, {userId: userId, senderModel: "registration"}]
    }else if(sender && registerReciever){
      userModel = [{userId: req.user._id, senderModel: "user"}, {userId: userId, senderModel: "registration"}]
    }else{
      userModel = [{userId: req.user._id, senderModel: "user"}, {userId: userId, senderModel: "registration"}]
    }

    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: userModel,
    };

    const createdChat = await Chat.create(chatData);
    let FullChat = await Chat.find({ _id: createdChat._id }).populate({
      path:"users.userId",
      select:"-password",
      options: { strictPopulate: false },
    })
    return res.status(200).json(FullChat);
    }
});

//getchat
export const fetchChats = catchAsyncError(async (req, res) => {


  let data = await Chat.find({users: { $elemMatch: { userId: req.user._id } } })
    .populate({
      path: "users.userId",
      select: "-password",
    })
    .populate("latestMessage")
    .sort({ updatedAt: -1 }).populate({
        path: "latestMessage.sender",
        select: "firstname email companyname name",
      });
      return res.status(200).send(data);
});


export const allMessages = catchAsyncError(async (req, res) => {
  var messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "firstname companyname email")
      .populate("chat");
  res.status(200).send(messages);
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
export const sendMessage = catchAsyncError(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  const userModel = await register.find({_id: req.user._id.toString()});

  let sendModle;
  if(userModel.length === 0){
    sendModle = "user"
  }else{
    sendModle = "registration"
  }

  const newMessage = {
    sender: req.user._id.toString(),
    senderModel: sendModle,
    content: content,
    chat: chatId,
  };

  let message = await Message.create(newMessage);
  console.log(message)
  message = await message.populate("sender", "firstname lastname username companyname name")
  message = await message.populate("chat")
  message = await register.populate(message, {
    path: "chat.users",  
    select: "firstname lastname companyname name",
  });

  await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
  return res.status(200).send(message);
});