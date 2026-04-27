import NgoEmployee from "../models/ngoEmployee.models.js";

export const findNearbyWorkers = async (req, res) => {
  try {
    const { category, location } = req.body;
    const { latitude, longitude } = location;

    let radius = 500;
    let allWorkers = [];
    let uniqueIds = new Set();

    while (uniqueIds.size < 10 && radius <= 10000) {
      const workers = await NgoEmployee.find({
        category: category,
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
      });

      let newCount = 0;

      workers.forEach(worker => {
        if (!uniqueIds.has(worker._id.toString())) {
          uniqueIds.add(worker._id.toString());
          allWorkers.push(worker);
          newCount++;
        }
      });

      console.log(
        `Added ${newCount} new workers | Total = ${uniqueIds.size} within ${radius} meters`
      );

      if (uniqueIds.size >= 10) break;

      radius += 500;
    }

    return res.json({
      message: "Workers found",
      radiusUsed: radius,
      count: allWorkers.length,
      workers: allWorkers.slice(0, 10)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};