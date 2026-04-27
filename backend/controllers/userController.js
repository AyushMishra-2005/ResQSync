import User from "../models/User.js";

export const syncUser = async (req, res) => {
  try {
    const { clerkId, name } = req.body;

    const user = await User.findOneAndUpdate(
      { clerkId },                 
      { name },                   
      { new: true, upsert: true } 
    );

    console.log("User synced:", user);

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error syncing user"
    });
  }
};