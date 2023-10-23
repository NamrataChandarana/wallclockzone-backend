import { config } from "dotenv";
config({
  path: "./data/config.env",
});
import express from "express";
import userRouter from "./routers/user.js";
import { connectDB } from "./data/database.js";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.js";
import path from "path";
import cors from "cors";

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

app.use(express.static(path.join(path.resolve(), "public")));

//setting view engine
app.set("view engine", "ejs");

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin: http://localhost:3000");
//   res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers: Content-Type, Authorization, X-Auth-Token, Origin"
//   );
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

//middelwares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/users", userRouter);

//error middelware
app.use(errorMiddleware);

//db connection
connectDB();

const listen = app.listen(process.env.PORT, (req, res) => {
  console.log(`done and ${process.env.FRONTEND_URL}`);
});

//unhandled error (server error)
process.on("unhandlerRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
