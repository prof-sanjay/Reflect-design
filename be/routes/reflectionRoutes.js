import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  saveReflection,
  getReflectionByDate,
  getAllReflections, fetchMoods
} from "../controllers/reflectionController.js";


const router = express.Router();

/* IMPORTANT: Put "/" before "/:date" */
router.get("/", protect, getAllReflections);
router.get("/:date", protect, getReflectionByDate);
router.post("/", protect, saveReflection);
router.post("/update", protect, updateReflection);
router.get("/moods/all", authMiddleware, fetchMoods); // 👈 add this


export default router;
