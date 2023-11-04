import mongoose from "mongoose";

// schema and model for registration
const registration = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: new Date(),
  },
  firstname: {
    type: String,
    required: [true, "Please Enter Your fristName"],
  },
  lastname: {
    type: String,
    required: [true, "Please Enter Your lastName"],
  },
  companyname: {
    type: String,
    required: [true, "Please Enter Your name of company"],
  },
  phoneNo: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  category: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    // validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  website: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: "false",
  },
  role: {
    type: String,
    default: "user",
  },
});

export const register = new mongoose.model("registration", registration);

// const stateModel = mongoose.Schema({
//   name: { type: String },
// });

// export const state = new mongoose.model("state", stateModel);

// const stateData = [
//   {
//     "Andhra Pradesh": new ObjectId(), // Let MongoDB generate the ObjectId
// Let MongoDB generate the ObjectId
// Add more states here
//   },
//   {
//     "Telangana": new ObjectId(),
//   },
// ];

// state.insertMany(stateData);

// const stateData = [
//   { "Andhra Pradesh": new ObjectId() },
//   {
//    "Telangana": new ObjectId(),
//   },
//   // Add more states here
// ];

// { _id: new ObjectId(2), name: "Andhra Pradesh" },
// { _id: new ObjectId(3), name: "Arunachal Pradesh" },
// { _id: new ObjectId(4), name: "Assam" },
// { _id: new ObjectId(5), name: "Bihar" },
// { _id: new ObjectId(6), name: "Chhattisgarh" },
// { _id: new ObjectId(7), name: "Goa" },
// { _id: new ObjectId(8), name: "Gujarat" },
// { _id: new ObjectId(9), name: "Haryana" },
// { _id: new ObjectId(10), name: "Himachal Pradesh" },
// { id: 11, name: "Jammu & Kashmir" },
// { id: 12, name: "Jharkhand" },
// { id: 13, name: "Karnataka" },
// { id: 14, name: "Kerala" },
// { id: 15, name: "Madhya Pradesh" },
// { id: 16, name: "Maharashtra" },
// { id: 17, name: "Manipur" },
// { id: 18, name: "Meghalaya" },
// { id: 19, name: "Mizoram" },
// { id: 20, name: "Nagaland" },
// { id: 21, name: "Orissa" },
// { id: 22, name: "Punjab" },
// { id: 23, name: "Rajasthan" },
// { id: 24, name: "Sikkim" },
// { id: 25, name: "Tamil Nadu" },
// { id: 26, name: "Tripura" },
// { id: 27, name: "Uttar Pradesh" },
// { id: 28, name: "Uttarakhand" },
// { id: 29, name: "West Bengal" },
// { id: 30, name: "Andaman & Nicobar Islands" },
// { id: 31, name: "Chandigarh" },
// { id: 32, name: "Dadra & Nagar Haveli" },
// { id: 33, name: "Daman & Diu" },
// { id: 34, name: "Delhi" },
// { id: 35, name: "Lakshadweep" },
// { id: 36, name: "Puducherry" },
// { id: 37, name: "London" },
// { id: 38, name: "Kabul" },
// { id: 39, name: "Kandahar" },

// state.insertMany(stateData);

// const cityModel = mongoose.Schema({
//   id: { type: Number },
//   city: { type: String },
//   state_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "state",
//   },
// });

// export const city = new mongoose.model("city", cityModel);

// const cityData = [
//   {
//     name: "Hyderabad",
//     state_id: stateData["Telangana"],
//   },
//   {
//     name: "hariyana",
//     state_id: stateData["Telangana"],
//   },
// ];

// const cityData = [
//   {
//     id: 1,
//     city: "Hyderabad/Secunderabad",
//     state_id: new ObjectId(stateData._id),
//   },
//   { id: 2, city: "Visakhapatnam", state_id: new ObjectId(2) },
//   { id: 3, city: "Chittoor", state_id: new ObjectId(2) },
//   { id: 4, city: "Vijaywada", state_id: new ObjectId(2) },
// ];

// city.insertMany(cityData);
