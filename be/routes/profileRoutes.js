import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { saveProfile, getProfile } from "../controllers/profileController.js";

const router = express.Router();

// Save or Update Profile
router.post("/", protect, saveProfile);

// Get Profile
router.get("/", protect, getProfile);

export default router;
