const User = require("../Models/User");

// Get Provider Availability
const getAvailability = async (req, res) => {
  try {
    const provider = await User.findOne({
      _id: req.user.id,
      role: "provider",
    }).select("availability");

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


// Update Provider Availability
const updateAvailability = async (req, res) => {
  try {
    const {
      days,
      startTime,
      endTime,
    } = req.body;

    // Validate days
    if (!Array.isArray(days)) {
      return res.status(400).json({
        message: "Days must be an array",
      });
    }

    // At least one working day
    if (days.length === 0) {
      return res.status(400).json({
        message: "Select at least one working day",
      });
    }

    // Validate time
    if (!startTime || !endTime) {
      return res.status(400).json({
        message: "Start time and end time are required",
      });
    }

    // Convert time into minutes
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (
      Number.isNaN(startMinutes) ||
      Number.isNaN(endMinutes)
    ) {
      return res.status(400).json({
        message: "Invalid time format",
      });
    }

    if (startMinutes >= endMinutes) {
      return res.status(400).json({
        message: "End time must be later than start time",
      });
    }

    // Update provider availability
    const provider = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        role: "provider",
      },
      {
        availability: {
          days,
          startTime,
          endTime,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("availability");

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

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


module.exports = {
  getAvailability,
  updateAvailability,
};