import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * 🔐 Authentication Middleware
 * Verifies JWT token and attaches user info to req.user
 * Used to protect routes (tasks, goals, wellness, etc.)
 */
export const protect = async (req, res, next) => {
  let token;

  try {
    // ✅ 1. Get token from Authorization header (Bearer <token>)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ✅ 2. Optionally check cookies (for web sessions)
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // ❌ No token found
    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
      });
    }

    // ✅ 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ 4. Find user from decoded token payload
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found or token invalid.",
      });
    }

    // ✅ 5. Attach user to request and continue
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);

    // Handle common JWT errors cleanly
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please log in again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token. Please log in again.",
      });
    }

    // Default fallback
    return res.status(401).json({
      message: "Unauthorized access.",
    });
  }
};
