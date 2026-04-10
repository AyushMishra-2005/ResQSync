import mongoose from "mongoose";

const ngoEmployeeSchema = new mongoose.Schema({
  empId: String,
  name: String,
  age: Number,
  gender: String,
  phone: String,

  skills: [String],
  category: [String],

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },

  availability: String
});

ngoEmployeeSchema.index({ location: "2dsphere" });

export default mongoose.model("NgoEmployee", ngoEmployeeSchema);