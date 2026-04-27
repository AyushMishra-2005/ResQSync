import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
   category: {
    type: String,
    default: "General",
  },

  priority: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "LOW",
  },

  problem: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "assigned", "completed"],
    default: "pending"
  },

  assignedVolunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NgoEmployee",
    default: null
  },

  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }

}, { timestamps: true });

const Request = mongoose.models.Request || mongoose.model("Request", requestSchema);

export default Request;