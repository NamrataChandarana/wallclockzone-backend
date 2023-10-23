import exp from "constants";
import { connect } from "http2";
import mongoose from "mongoose";
import { State } from "country-state-city";

// db connection
export const connectDB = (db) => {
  mongoose
    .connect(process.env.MONGO_LINK, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((c) => {
      console.log(`connectd ${c.connection.host}`);
    });
};
