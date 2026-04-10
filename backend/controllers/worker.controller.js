import NgoEmployee from "../models/ngoEmployee.models.js";

export const findNearbyWorkers = async (req, res) => {
  try {
    const { category, location } = req.body;
    const { latitude, longitude } = location;

    let radius = 500; 
    let workers = [];

    while (workers.length < 10 && radius <= 10000) {
      workers = await NgoEmployee.find({
        category: { $in: [category] },
        availability: "free",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            $maxDistance: radius
          }
        }
      }).limit(10);

      if (workers.length < 10) {
        console.log(`Only ${workers.length} found within ${radius} meters`);
        radius += 500; 
      }
    }

    return res.json({
      message: "Workers found",
      radiusUsed: radius,
      count: workers.length,
      workers
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};