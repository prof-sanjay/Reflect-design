// be/controllers/bookingController.js
import Booking from "../models/Booking.js";
import Therapist from "../models/Therapist.js";
import User from "../models/userModel.js";

// CREATE new booking
export const createBooking = async (req, res) => {
  try {
    const { therapistId, date, time, notes } = req.body;

    if (!therapistId || !date || !time) {
      return res.status(400).json({ message: "Therapist, date, and time are required" });
    }

    // Check if therapist exists
    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }

    // Check if booking already exists for this time slot
    const existingBooking = await Booking.findOne({
      therapist: therapistId,
      date: new Date(date),
      time,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      return res.status(400).json({ message: "This time slot is already booked" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      therapist: therapistId,
      date: new Date(date),
      time,
      notes,
    });

    // Populate therapist info for response
    await booking.populate("therapist", "user");
    await booking.populate("therapist.user", "username");

    res.status(201).json(booking);
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Failed to create booking", error: error.message });
  }
};

// GET user's bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("therapist", "user")
      .populate("therapist.user", "username")
      .sort({ date: -1, time: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};

// GET therapist's bookings (for therapist dashboard)
export const getTherapistBookings = async (req, res) => {
  try {
    // Find therapist record for current user
    const therapist = await Therapist.findOne({ user: req.user._id });
    if (!therapist) {
      return res.status(404).json({ message: "Therapist profile not found" });
    }

    const bookings = await Booking.find({ therapist: therapist._id })
      .populate("user", "username")
      .sort({ date: 1, time: 1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get therapist bookings error:", error);
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
};

// UPDATE booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is authorized to update this booking
    const therapist = await Therapist.findOne({ user: req.user._id });
    if (!therapist || booking.therapist.toString() !== therapist._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this booking" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json(booking);
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ message: "Failed to update booking", error: error.message });
  }
};

// CANCEL booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is authorized to cancel this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Failed to cancel booking", error: error.message });
  }
};
