// be/routes/wellnessRoutes.js
import express from "express";
import {
  createWellnessEntry,
  getWellnessEntries,
  getWellnessEntryByDate,
  updateWellnessEntry,
  deleteWellnessEntry,
  getWellnessStats
} from "../controllers/wellnessController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createWellnessEntry);
router.get("/", getWellnessEntries);
router.get("/date/:date", getWellnessEntryByDate);
router.put("/:id", updateWellnessEntry);
router.delete("/:id", deleteWellnessEntry);
router.get("/stats", getWellnessStats);

export default router;