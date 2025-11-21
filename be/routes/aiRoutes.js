// be/routes/aiRoutes.js
import express from "express";
import {
  predictMood,
  summarizeReflection,
  getUserInsights,
} from "../controllers/aiController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/predict-mood", protect, predictMood);
router.post("/summarize", protect, summarizeReflection);
router.get("/insights/:userId", protect, authorize("therapist", "admin"), getUserInsights);

export default router;
