import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { saveProfile, getProfile } from "../controllers/profileController.js";

const router = express.Router();

// Save or update profile
router.post("/", protect, saveProfile);

// MUST MATCH FRONTEND REQUEST
router.get("/me", protect, getProfile);

export default router;
