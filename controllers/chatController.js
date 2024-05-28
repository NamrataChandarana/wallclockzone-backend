import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Chat } from "../models/chatModel.js";
import { register } from "../models/user.js";
import { Message } from "../models/messageModel.js";

// chat

export const searchUser = catchAsyncError(async (req, res, next) => {
    const keyword = req.query.search ? {
      $or: [
        {companyname: {$regex: req.query.search, $options: "i"}},
        {email: {$regex: req.query.search, $options: "i"}},
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
  console.log("hello");
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
    .populate("users", "-password")
    .populate("latestMessage");

  // console.log(isChat);
  // console.log(register);
  isChat = await Chat.populate(isChat, {
    path: "latestMessage.sender",
    select: "firstname email companyname",
  });

  if (isChat.length > 0) {
    return res.send(isChat[0]);
    console.log(isChat[0])
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    console.log(res)
    return res.status(200).json(FullChat);
  
    }
});

//getchat
export const fetchChats = catchAsyncError(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
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


export const allMessages = catchAsyncError(async (req, res) => {
  // console.log(typeOf (req.params.chatId));
  try {
    var messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "firstname companyname email")
        .populate("chat");
    res.status(200).send(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
export const sendMessage = catchAsyncError(async (req, res) => {
  const { content, chatId } = req.body;
  console.log(chatId);

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);
    console.log(message);

    message = await message.populate("sender", "firstname lastname username compnyname") 
    message = await message.populate("chat")
    message = await register.populate(message, {
      path: "chat.users",  //pending chat field is not in register model
      select: "firstname lastname compnyname ",
    });
    console.log(message);

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.status(200).send(message);
    
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});