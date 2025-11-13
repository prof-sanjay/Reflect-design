import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  saveWellnessData,
  getWellnessData,
  getWellnessHistory
} from "../controllers/wellnessController.js";

const router = express.Router();

router.post("/", protect, saveWellnessData);
router.get("/", protect, getWellnessData);

// ⭐ REQUIRED
router.get("/history", protect, getWellnessHistory);

export default router;
