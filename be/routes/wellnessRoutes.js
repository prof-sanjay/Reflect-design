import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { saveWellnessData, getWellnessData } from "../controllers/wellnessController.js";

const router = express.Router();

// ✅ Save or update wellness data
router.post("/", protect, saveWellnessData);

// ✅ Get user's wellness data
router.get("/", protect, getWellnessData);

export default router;
