const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role === "provider" ? "provider" : "user",
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// ==========================================
// UPDATE PROVIDER AVAILABILITY
// ==========================================

const updateAvailability = async (req, res) => {
  try {
    const { days, startTime, endTime } = req.body;

    // Only providers can update availability
    if (req.user.role !== "provider") {
      return res.status(403).json({
        message: "Only providers can update availability",
      });
    }

    // Required fields
    if (
      !Array.isArray(days) ||
      days.length === 0 ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        message: "Days, start time and end time are required",
      });
    }

    // Validate time format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!timeRegex.test(startTime)) {
      return res.status(400).json({
        message: "Invalid start time",
      });
    }

    if (!timeRegex.test(endTime)) {
      return res.status(400).json({
        message: "Invalid end time",
      });
    }

    // Convert time to minutes
    const convertToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const startMinutes = convertToMinutes(startTime);
    const endMinutes = convertToMinutes(endTime);

    // Start time must be before end time
    if (startMinutes >= endMinutes) {
      return res.status(400).json({
        message: "Start time must be before end time",
      });
    }

    // Allowed days
    const allowedDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    // Validate days
    const invalidDay = days.some(
      (day) => !allowedDays.includes(day)
    );

    if (invalidDay) {
      return res.status(400).json({
        message: "Invalid day selected",
      });
    }

    // Update provider
    const provider = await User.findByIdAndUpdate(
      req.user.id,
      {
        availability: {
          days,
          startTime,
          endTime,
        },
      },
      {
        new: true,
      }
    ).select("-password");

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

    console.error(
      "Update availability error:",
      error
    );

    res.status(500).json({
      message: "Failed to update availability",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateAvailability,
};