const User = require("../Models/User");

const updateAvailability = async (req, res) => {
  try {
    const { days, startTime, endTime } = req.body;

    if (!Array.isArray(days) || days.length === 0) {
      return res.status(400).json({
        message: "At least one working day is required",
      });
    }

    if (!startTime || !endTime) {
      return res.status(400).json({
        message: "Start time and end time are required",
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        message: "End time must be later than start time",
      });
    }

    const provider = await User.findById(req.user.id);

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    provider.availability = {
      days,
      startTime,
      endTime,
    };

    await provider.save();

    res.status(200).json({
      message: "Availability updated successfully",
      availability: provider.availability,
    });

  } catch (error) {
    console.error("Update availability error:", error);

    res.status(500).json({
      message: "Failed to update availability",
    });
  }
};

const getAvailability = async (req, res) => {
  try {
    const provider = await User.findById(req.user.id)
      .select("name availability");

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    res.status(200).json({
      availability: provider.availability,
    });

  } catch (error) {
    console.error("Get availability error:", error);

    res.status(500).json({
      message: "Failed to fetch availability",
    });
  }
};

module.exports = {
  updateAvailability,
  getAvailability,
};