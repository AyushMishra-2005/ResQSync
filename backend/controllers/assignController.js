import Request from "../models/Request.js";

export const assignWorker = async (req, res) => {
  try {
    const { workerId, requestId } = req.body;

    console.log("Assigning:", workerId, requestId);

    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      {
        assignedVolunteer: workerId,
        status: "assigned"
      },
      { returnDocument: "after" }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "Request not found"
      });
    }

    res.json({
      success: true,
      request: updatedRequest
    });

  } catch (error) {
    console.error("Assign error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to assign worker"
    });
  }
};