const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ---------- POST: REGISTER NEW USER ----------
router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      return res.status(400).json({
        error: "Email, password, and role are required",
      });
    }

    // Validate email format - must end with @gmail.com
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      return res.status(400).json({
        error: "Email must be a Gmail address (ending with @gmail.com)",
      });
    }

    // Validate role
    if (role !== "student" && role !== "admin") {
      return res.status(400).json({
        error: "Role must be either 'student' or 'admin'",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "User with this email already exists",
      });
    }

    // Create new user
    const newUser = new User({
      email,
      password, // Plain text for now (as per requirements)
      role,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to register user",
    });
  }
});

// ---------- POST: LOGIN USER ----------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Validate email format - must end with @gmail.com
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      return res.status(400).json({
        error: "Email must be a Gmail address (ending with @gmail.com)",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Check password (plain text comparison for now)
    if (user.password !== password) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Return user info (without password)
    res.status(200).json({
      message: "Login successful",
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to login",
    });
  }
});

module.exports = router;

