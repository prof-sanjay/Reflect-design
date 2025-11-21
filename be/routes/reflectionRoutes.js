// be/routes/reflectionRoutes.js
import express from "express";
import {
  getReflections,
  getReflectionByDate,
  createReflection,
  updateReflection,
  deleteReflection,
} from "../controllers/reflectionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All routes require authentication

router.get("/", getReflections);
router.get("/date/:date", getReflectionByDate);
router.post("/", createReflection);
router.put("/:id", updateReflection);
router.delete("/:id", deleteReflection);

export default router;
