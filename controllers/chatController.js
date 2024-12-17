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
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
  .populate({
    path: "users",
    select: "-password",
    populate: { path: "senderModel" }, // Populate dynamically based on `senderModel`
  })
  .populate("latestMessage");

  isChat = await Chat.populate(isChat, {
    path: "latestMessage.sender",
    select: "firstname email companyname name",
  });

  if (isChat.length > 0) {
    return res.send(isChat[0]);
    console.log(isChat[0])
  } else {

    const registerSender = await register.find({_id: req.user._id});
    const sender = await user.find({_id: req.user._id});
    const reciever = await user.find({_id: userId});
    const registerReciever = await register.find({_id:userId});

    let userModel;
    if(registerSender && reciever){
      userModel = [{_id: req.user._id, senderModel: "registration"}, {_id: userId, senderModel: "user"}]
    }else if(registerSender && registerReciever){
      userModel = [{_id: req.user._id, senderModel: "registration"}, {_id: userId, senderModel: "registration"}]
    }else if(sender && registerReciever){
      userModel = [{_id: req.user._id, senderModel: "user"}, {_id: userId, senderModel: "registration"}]
    }else{
      userModel = [{_id: req.user._id, senderModel: "user"}, {_id: userId, senderModel: "registration"}]
    }

    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: userModel,
    };

    const createdChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate({
      path: "users",
      select: "-password",
      populate: { path: "senderModel" }, 
    }).populate("latestMessage");

    return res.status(200).json(FullChat);
    }
});

//getchat
export const fetchChats = catchAsyncError(async (req, res) => {
  Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
    .populate("users", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await register.populate(results, {
        path: "latestMessage.sender",
        select: "firstname email companyname",
      });
      return res.status(200).send(results);
  });
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

  const userModel = await user.find({_id: req.user._id.toString()});
  let sendModle;
  if(!userModel){
    sendModle = "registration"
  }else{
    sendModle = "user"
  }

  const newMessage = {
    sender: req.user._id.toString(),
    senderModel: sendModle,
    content: content,
    chat: chatId,
  };

  var message = await Message.create(newMessage);
  message = await message.populate("sender", "firstname lastname username companyname name") 
  message = await message.populate("chat")
  message = await register.populate(message, {
    path: "chat.users",  
    select: "firstname lastname companyname ",
  });

  await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
  return res.status(200).send(message);
});