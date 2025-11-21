// be/routes/adminRoutes.js
import express from "express";
import {
  getAllUsers,
  updateUser,
  assignTherapist,
  createPrompt,
  getAllPrompts,
  updatePrompt,
  deletePrompt,
  sendBroadcastNotification,
  getAlerts,
  resolveAlert,
  monitorRiskLevels,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// User management
router.get("/users", protect, authorize("admin"), getAllUsers);
router.put("/users/:userId", protect, authorize("admin"), updateUser);
router.post("/assign-therapist", protect, authorize("admin"), assignTherapist);

// Prompt management
router.post("/prompts", protect, authorize("admin"), createPrompt);
router.get("/prompts", protect, authorize("admin"), getAllPrompts);
router.put("/prompts/:promptId", protect, authorize("admin"), updatePrompt);
router.delete("/prompts/:promptId", protect, authorize("admin"), deletePrompt);

// Notifications
router.post("/broadcast", protect, authorize("admin"), sendBroadcastNotification);

// Alerts
router.get("/alerts", protect, authorize("admin"), getAlerts);
router.put("/alerts/:alertId/resolve", protect, authorize("admin"), resolveAlert);
router.post("/monitor-risk", protect, authorize("admin"), monitorRiskLevels);

export default router;
