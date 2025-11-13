import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  saveReflection,
  getReflectionByDate,
  getAllReflections
} from "../controllers/reflectionController.js";

const router = express.Router();

/* IMPORTANT: Put "/" before "/:date" */
router.get("/", protect, getAllReflections);
router.get("/:date", protect, getReflectionByDate);
router.post("/", protect, saveReflection);

export default router;
