import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getReflections,
  createReflection,
  deleteReflection,
} from "../controllers/reflectionController.js";

const router = express.Router();

// ✅ Protected routes
router.get("/", protect, getReflections);
router.post("/", protect, createReflection);
router.delete("/:id", protect, deleteReflection);

export default router;
