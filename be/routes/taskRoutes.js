import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

/**
 * ✅ Task Routes
 * All routes are protected — only authenticated users can access their tasks.
 * Each task is linked to a specific user (via userId).
 */

// @route   GET /api/tasks
// @desc    Get all tasks for the logged-in user
// @access  Private
router.get("/", protect, getTasks);

// @route   POST /api/tasks
// @desc    Create a new task for the logged-in user
// @access  Private
router.post("/", protect, createTask);

// @route   PUT /api/tasks/:id
// @desc    Update an existing task by ID
// @access  Private
router.put("/:id", protect, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task by ID
// @access  Private
router.delete("/:id", protect, deleteTask);

export default router;
