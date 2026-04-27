import Request from "../models/Request.js";
import User from "../models/User.js";

export const createRequest = async (req, res) => {
  try {
    console.log("🔥 Incoming Request Body:", req.body);

    const { clerkId, text, location, category, priority } = req.body;

    // 🔥 Step 1: Find user
    const user = await User.findOne({ clerkId });

    console.log("👤 Found User:", user);

    if (!user) {
      console.log("❌ User not found for clerkId:", clerkId);

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 Step 2: Create request
    const request = await Request.create({
      user: user._id,
      problem: text,
      category: category || undefined,
      priority: priority || undefined,
      location: {
        lat: location.latitude,
        lng: location.longitude,
      },
    });

    console.log("✅ Request Created:", request);

    res.status(201).json({
      success: true,
      request,
    });
  } catch (error) {
    console.error("🚨 Error creating request:", error);

    res.status(500).json({
      success: false,
      message: "Error creating request",
    });
  }
};
export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("user") // optional but useful
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching requests",
    });
  }
};
export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 check if exists
    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // 🔥 delete
    await Request.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Request deleted successfully",
    });

  } catch (error) {
    console.error("❌ Error deleting request:", error);

    res.status(500).json({
      success: false,
      message: "Error deleting request",
    });
  }
};

