import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  let token;

  try {
    // ✅ Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // ✅ Verify token using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Attach user info (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      // ✅ Continue to next middleware or route
      next();
    } else {
      return res.status(401).json({ message: "No token provided" });
    }
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
