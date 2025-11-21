// be/routes/analyticsRoutes.js
import express from "express";
import {
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getAdminAnalytics,
} from "../controllers/analyticsController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/weekly", protect, getWeeklyAnalytics);
router.get("/monthly", protect, getMonthlyAnalytics);
router.get("/admin", protect, authorize("admin"), getAdminAnalytics);

export default router;
