const Booking = require("../Models/Booking");
const Service = require("../Models/Service");
const User = require("../Models/User");
const Notification = require("../Models/Notification");

// ===============================
// CREATE EMERGENCY BOOKING
// ===============================
const createEmergencyBooking = async (req, res) => {
  try {
    const {
      service,
      phone,
      provider,
      customerLocation,
      notes,
    } = req.body;

    // Required fields
    if (!service || !phone || !provider || !customerLocation) {
      return res.status(400).json({
        message:
          "Service, phone, provider and customer location are required",
      });
    }

    // Validate phone
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone number must contain exactly 10 digits",
      });
    }

    // Validate customer location
    const { latitude, longitude } = customerLocation;

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        message: "Valid customer location is required",
      });
    }

    // Find service
    const selectedService = await Service.findById(service);

    if (!selectedService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Only approved services can be booked
    if (selectedService.status !== "approved") {
      return res.status(400).json({
        message: "This service is not available for booking",
      });
    }

    // Service must have provider
    if (!selectedService.provider) {
      return res.status(400).json({
        message: "Service provider is not assigned",
      });
    }

    // Make sure selected provider belongs to selected service
    if (
      selectedService.provider.toString() !==
      provider.toString()
    ) {
      return res.status(400).json({
        message: "Selected provider does not provide this service",
      });
    }

    // Find provider
    const selectedProvider = await User.findOne({
      _id: provider,
      role: "provider",
    });

    if (!selectedProvider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    // Provider must be active
    if (selectedProvider.isActive === false) {
      return res.status(400).json({
        message: "This provider is currently unavailable",
      });
    }

    // Prevent provider booking their own service
    if (
      selectedService.provider.toString() ===
      req.user.id.toString()
    ) {
      return res.status(400).json({
        message: "You cannot book your own service",
      });
    }

    // Current date and time
    const now = new Date();

    const emergencyDate = now.toISOString().split("T")[0];
    const emergencyTime = now.toTimeString().slice(0, 5);

    // Create emergency booking
    const booking = new Booking({
      user: req.user.id,
      service: selectedService._id,
      provider: selectedProvider._id,
      phone,
      date: emergencyDate,
      time: emergencyTime,
      notes: notes || "",

      bookingType: "emergency",

      customerLocation: {
        latitude,
        longitude,
      },

      status: "pending",
    });

    await booking.save();

    // Create provider notification
    const notification = await Notification.create({
      recipient: selectedProvider._id,
      message: `🚨 Emergency request for ${selectedService.name}. A customer needs immediate service.`,
      type: "booking",
    });

    // Send real-time notification
    const io = req.app.get("io");

    if (io) {
      io.to(`user_${selectedProvider._id}`).emit(
        "newNotification",
        notification
      );
    }

    res.status(201).json({
      message: "Emergency booking created successfully",
      booking,
    });
  } catch (error) {
    console.error(
      "Create emergency booking error:",
      error
    );

    res.status(500).json({
      message: "Failed to create emergency booking",
    });
  }
};

// ===============================
// GET NEARBY EMERGENCY PROVIDERS
// ===============================
const getNearbyEmergencyProviders = async (req, res) => {
  try {
    const { latitude, longitude, service } = req.body;

    // Validate required fields
    if (
      latitude === undefined ||
      longitude === undefined ||
      !service
    ) {
      return res.status(400).json({
        message: "Latitude, longitude and service are required",
      });
    }

    // Validate coordinates
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return res.status(400).json({
        message: "Latitude and longitude must be numbers",
      });
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        message: "Invalid latitude",
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        message: "Invalid longitude",
      });
    }

    // Find requested service
    const selectedService = await Service.findById(service);

    if (!selectedService) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Only approved services can be used
    if (selectedService.status !== "approved") {
      return res.status(400).json({
        message: "This service is not available",
      });
    }

    // Find providers who offer this service
    const providers = await User.find({
      _id: selectedService.provider,
      role: "provider",
      isActive: true,
      "location.coordinates": {
        $exists: true,
      },
    }).select(
      "name email phone professionalDescription experience location availability"
    );

    // Maximum emergency search radius
    const MAX_DISTANCE_KM = 10;

    // Calculate distance between two coordinates
    const calculateDistance = (
      lat1,
      lon1,
      lat2,
      lon2
    ) => {
      const R = 6371;

      const dLat =
        ((lat2 - lat1) * Math.PI) / 180;

      const dLon =
        ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) *
          Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c =
        2 *
        Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
        );

      return R * c;
    };

    const nearbyProviders = providers
      .map((provider) => {
        const coordinates =
          provider.location?.coordinates;

        // Ignore providers without real location
        if (
          !Array.isArray(coordinates) ||
          coordinates.length !== 2 ||
          coordinates[0] === 0 ||
          coordinates[1] === 0
        ) {
          return null;
        }

        // MongoDB stores [longitude, latitude]
        const providerLongitude = coordinates[0];
        const providerLatitude = coordinates[1];

        const distance = calculateDistance(
          latitude,
          longitude,
          providerLatitude,
          providerLongitude
        );

        return {
          provider,
          distance: Number(distance.toFixed(2)),
        };
      })
      .filter(
        (item) =>
          item !== null &&
          item.distance <= MAX_DISTANCE_KM
      )
      .sort(
        (a, b) => a.distance - b.distance
      );

    res.status(200).json({
      message: "Nearby emergency providers found",
      providers: nearbyProviders,
    });
  } catch (error) {
    console.error(
      "Get nearby emergency providers error:",
      error
    );

    res.status(500).json({
      message: "Failed to find nearby emergency providers",
    });
  }
};

module.exports = {
  createEmergencyBooking,
  getNearbyEmergencyProviders,
};