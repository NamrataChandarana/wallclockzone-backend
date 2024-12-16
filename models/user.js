import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:String,
    email: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
})

export const user = new mongoose.model("user",userSchema);