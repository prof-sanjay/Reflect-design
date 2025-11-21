// be/routes/therapistRoutes.js
import express from "express";
import {
  getAllTherapists,
  getTherapistById,
  upsertTherapistProfile,
  getMyProfile,
  getMyPatientsAndBookings,
  getAllTherapistProfiles,
  approveTherapistProfile,
  addReview,
  getReviews,
} from "../controllers/therapistController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/list", getAllTherapists);

// Admin routes
router.get("/admin/all", authorize("admin"), getAllTherapistProfiles);
router.put("/admin/approve/:therapistId", authorize("admin"), approveTherapistProfile);

// Protected routes for therapists
router.use(protect);
router.route("/profile")
  .post(upsertTherapistProfile)
  .get(getMyProfile);
  
router.get("/patients", authorize("therapist"), getMyPatientsAndBookings);

// Public review routes (must be after specific routes)
router.post("/:id/review", protect, addReview);
router.get("/:id/reviews", getReviews);
router.get("/:id", getTherapistById);

export default router;
