const ServiceFollowUp = require("../Models/ServiceFollowUp");
const Booking = require("../Models/Booking");
const Notification = require("../Models/Notification");

// =====================================================
// SCHEDULE SERVICE FOLLOW-UP
// Provider schedules a reminder after completing a booking
// =====================================================

const scheduleServiceFollowUp = async (
  req,
  res
) => {
  try {
    const {
      bookingId,
      value,
      unit,
    } = req.body;

    // Validate follow-up value
    if (
      value === undefined ||
      value === null ||
      Number(value) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Follow-up time must be greater than 0",
      });
    }

    // Validate follow-up unit
    const validUnits = [
      "minutes",
      "hours",
      "days",
      "weeks",
    ];

    if (!validUnits.includes(unit)) {
      return res.status(400).json({
        success: false,
        message: "Invalid follow-up time unit",
      });
    }

    // Find completed booking owned by this provider
    const booking = await Booking.findOne({
      _id: bookingId,
      provider: req.user.id,
      status: "completed",
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message:
          "Completed booking not found",
      });
    }

    // Prevent duplicate follow-up
    const existingFollowUp =
      await ServiceFollowUp.findOne({
        booking: booking._id,
        status: "scheduled",
      });

    if (existingFollowUp) {
      return res.status(400).json({
        success: false,
        message:
          "A follow-up is already scheduled for this booking",
      });
    }

    // Calculate follow-up date
    const followUpDate = new Date();

    const followUpValue = Number(value);

    if (unit === "minutes") {
      followUpDate.setMinutes(
        followUpDate.getMinutes() + followUpValue
      );
    }

    if (unit === "hours") {
      followUpDate.setHours(
        followUpDate.getHours() + followUpValue
      );
    }

    if (unit === "days") {
      followUpDate.setDate(
        followUpDate.getDate() + followUpValue
      );
    }

    if (unit === "weeks") {
      followUpDate.setDate(
        followUpDate.getDate() +
          followUpValue * 7
      );
    }

    // Create follow-up record
    const followUp =
      await ServiceFollowUp.create({
        user: booking.user,
        booking: booking._id,
        service: booking.service,
        followUpDate,
      });

    res.status(201).json({
      success: true,
      message:
        "Follow-up scheduled successfully",
      followUp,
    });

  } catch (error) {
    console.error(
      "Schedule service follow-up error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to schedule service follow-up",
    });
  }
};

// =====================================================
// PROCESS DUE SERVICE FOLLOW-UPS
// Finds reminders whose date has arrived and
// creates a notification for the customer
// =====================================================

const processDueServiceFollowUps = async () => {
  try {
    const now = new Date();

    // Find follow-ups that are due and not yet notified
    const dueFollowUps = await ServiceFollowUp.find({
      status: "scheduled",
      notificationSent: false,
      followUpDate: { $lte: now },
    }).populate("service");

    for (const followUp of dueFollowUps) {
      // Create customer notification
      await Notification.create({
        recipient: followUp.user,
        booking: followUp.booking,
        message: `It's time to consider booking ${followUp.service?.name || "this service"} again.`,
        type: "follow_up",
      });

      // Mark follow-up as notified
      followUp.status = "notified";
      followUp.notificationSent = true;

      await followUp.save();
    }

    console.log(
      `Processed ${dueFollowUps.length} due service follow-ups`
    );
  } catch (error) {
    console.error(
      "Process due service follow-ups error:",
      error
    );
  }
};

module.exports = {
  scheduleServiceFollowUp,
  processDueServiceFollowUps,
};