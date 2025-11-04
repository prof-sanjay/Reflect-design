import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../controllers/goalController.js";

const router = express.Router();

/**
 * ✅ Goal Routes (Protected)
 * Each goal is linked to the logged-in user via user ID.
 */

// @route   GET /api/goals
// @desc    Get all goals for the logged-in user
// @access  Private
router.get("/", protect, getGoals);

// @route   POST /api/goals
// @desc    Create a new goal for the logged-in user
// @access  Private
router.post("/", protect, createGoal);

// @route   PUT /api/goals/:id
// @desc    Update a goal by ID
// @access  Private
router.put("/:id", protect, updateGoal);

// @route   DELETE /api/goals/:id
// @desc    Delete a goal by ID
// @access  Private
router.delete("/:id", protect, deleteGoal);

export default router;
