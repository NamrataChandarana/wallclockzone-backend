import { config } from "dotenv";
config({
  path: "./config.env",
});
import express from "express";
import userRouter from "./routers/user.js";
import chatRouter from './routers/chat.js';
import categoryRouter from "./routers/category.js";
import { connectDB } from "./data/database.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.js";
import path from "path";
import cors from "cors";
import { Server } from "socket.io";
import adminRouter from './routers/admin.js'
import { Socket } from "dgram";
import { createServer } from "http";
// import cookieParser from 'cookie-parser';
// import { connect } from 'http2';

//handing uncaught error
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandle promise rejection`);
  process.exit(1);
});

// create server
const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.static(path.join(path.resolve(), "public")));

//setting view engine
app.set("view engine", "ejs");

//middelwares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/admin", adminRouter)

//error middelware
app.use(errorMiddleware);

//db connection
connectDB();

const listen = app.listen(process.env.PORT, (req, res) => {
  console.log(`done and ${process.env.FRONTEND_URL}`);
});


const io = new Server(listen,{
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }
});

io.on("connection", (socket) => {
  console.log("user connected",socket.id);

  socket.on('setup',(userData)=>{
    socket.join(userData._id);
    socket.emit("connected");
  })

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (data) => {
    socket.to(data.chatId).emit('typing', data);
  });

  socket.on("stop typing", (data) => {
    socket.to(data.chatId).emit('stop typing', data);
  });

  socket.on("new message", (newMessageRecieved) => {

    if(!newMessageRecieved) return
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
      console.log("send");
    });
  });

  socket.off("setup",()=>{
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  })
});


//unhandled error (server error)
process.on("unhandlerRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
