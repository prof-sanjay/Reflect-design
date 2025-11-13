import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { saveReflection, getReflectionByDate } from "../controllers/reflectionController.js";

const router = express.Router();

router.post("/", protect, saveReflection);
router.get("/:date", protect, getReflectionByDate);

export default router;
