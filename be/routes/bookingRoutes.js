// be/routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  getMyBookings,
  getTherapistBookings,
  updateBookingStatus,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// User routes
router.post("/", createBooking);
router.get("/my-bookings", getMyBookings);
router.put("/:id/cancel", cancelBooking);

// Therapist routes
router.get("/therapist-bookings", getTherapistBookings);
router.put("/:id/status", updateBookingStatus);

export default router;
