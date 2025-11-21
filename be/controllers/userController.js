import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * ✅ Register a new user (Master Table)
 */
export const registerUser = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    // Validate role - only allow user or therapist signup
    const allowedRoles = ["user", "therapist"];
    const userRole = allowedRoles.includes(role) ? role : "user";

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email, role: userRole });
    await newUser.save();

    // If user is signing up as a therapist, create a therapist profile
    if (userRole === "therapist") {
      // Create a basic therapist profile
      const Therapist = (await import("../models/Therapist.js")).default;
      await Therapist.create({
        user: newUser._id,
        isApproved: false
      });
    }

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Signup failed.", error: error.message });
  }
};

/**
 * ✅ Login user and issue JWT token
 */
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Please enter both username and password." });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};

/**
 * ✅ Get user profile
 */
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const user = await User.findById(req.user.id).select("-password");
    
    // If user is a therapist, also get their therapist profile
    let therapistProfile = null;
    if (user.role === "therapist") {
      const Therapist = (await import("../models/Therapist.js")).default;
      therapistProfile = await Therapist.findOne({ user: user._id });
    }

    res.status(200).json({ user, therapistProfile });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile.", error: error.message });
  }
};
