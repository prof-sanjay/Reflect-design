// routes/reflectionRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  saveReflection,
  getReflectionByDate,
  getAllReflections,
  fetchMoods
} from "../controllers/reflectionController.js";

const router = express.Router();

/* -----------------------------------------------------
   ORDER IS IMPORTANT
------------------------------------------------------*/

// ⭐ 1. STATIC ROUTES FIRST
router.get("/moods/all", protect, fetchMoods);

// ⭐ 2. FILTERED LIST OF ALL REFLECTIONS
router.get("/", protect, getAllReflections);

// ⭐ 3. GET SPECIFIC REFLECTION BY DATE
router.get("/date/:date", protect, getReflectionByDate);

// ⭐ 4. CREATE or UPDATE REFLECTION
router.post("/", protect, saveReflection);

export default router;
