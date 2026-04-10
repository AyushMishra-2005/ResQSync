import mongoose from "mongoose";

const ngoEmployeeSchma = new mongoose.Schema({
  empId: String,
  name: String,
  age: Number,
  gender: String,
  phone: String,

  skills: [String],
  category: [String],

  location: {
    latitude: Number,
    longitude: Number
  },

  availability: String
});

export default mongoose.model("NgoEmployee", ngoEmployeeSchma);