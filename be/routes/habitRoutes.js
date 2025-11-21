// be/routes/habitRoutes.js
import express from "express";
import {
  createHabit,
  getHabits,
  markHabitComplete,
  updateHabit,
  deleteHabit,
  getHabitStats,
} from "../controllers/habitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createHabit);
router.get("/", protect, getHabits);
router.get("/stats", protect, getHabitStats);
router.put("/:habitId", protect, updateHabit);
router.post("/:habitId/complete", protect, markHabitComplete);
router.delete("/:habitId", protect, deleteHabit);

export default router;
