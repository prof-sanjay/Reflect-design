// be/controllers/therapistController.js
import Therapist from "../models/Therapist.js";
import User from "../models/userModel.js";
import Booking from "../models/Booking.js";

// GET all therapists (public)
export const getAllTherapists = async (req, res) => {
  try {
    // Find all users with therapist role
    const therapistUsers = await User.find({ role: "therapist" }).select("_id username");
    
    // Get therapist details (only approved therapists)
    const therapistIds = therapistUsers.map(user => user._id);
    const therapists = await Therapist.find({ user: { $in: therapistIds }, isApproved: true })
      .populate("user", "username")
      .sort({ averageRating: -1 });

    // Combine user info with therapist details
    const therapistList = therapists.map(therapist => ({
      _id: therapist._id,
      user: therapist.user,
      username: therapist.user?.username || "Therapist",
      firstName: therapist.firstName,
      lastName: therapist.lastName,
      specialization: therapist.specialization,
      bio: therapist.bio,
      address: therapist.address,
      pricePerSession: therapist.pricePerSession,
      availability: therapist.availability,
      averageRating: therapist.averageRating,
      totalReviews: therapist.totalReviews,
    }));

    res.status(200).json(therapistList);
  } catch (error) {
    console.error("Get therapists error:", error);
    res.status(500).json({ message: "Failed to fetch therapists", error: error.message });
  }
};

// GET therapist by ID
export const getTherapistById = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id)
      .populate("user", "username")
      .populate("reviews.user", "username");

    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }

    // Only allow viewing approved therapists (unless it's the therapist themselves or admin)
    if (!therapist.isApproved) {
      // Check if requester is the therapist themselves or an admin
      const requestingUser = req.user;
      if (!(requestingUser.role === "admin" || 
            (requestingUser.role === "therapist" && requestingUser._id.toString() === therapist.user._id.toString()))) {
        return res.status(404).json({ message: "Therapist not found" });
      }
    }

    res.status(200).json(therapist);
  } catch (error) {
    console.error("Get therapist error:", error);
    res.status(500).json({ message: "Failed to fetch therapist", error: error.message });
  }
};

// CREATE or UPDATE therapist profile
export const upsertTherapistProfile = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      phone, 
      email, 
      address, 
      specialization, 
      experience, 
      bio, 
      pricePerSession, 
      availability 
    } = req.body;

    // Check if therapist profile already exists
    let therapist = await Therapist.findOne({ user: req.user._id });

    if (therapist) {
      // Update existing profile
      therapist.firstName = firstName || therapist.firstName;
      therapist.lastName = lastName || therapist.lastName;
      therapist.phone = phone || therapist.phone;
      therapist.email = email || therapist.email;
      therapist.address = address || therapist.address;
      therapist.specialization = specialization || therapist.specialization;
      therapist.experience = experience || therapist.experience;
      therapist.bio = bio || therapist.bio;
      therapist.pricePerSession = pricePerSession || therapist.pricePerSession;
      therapist.availability = availability || therapist.availability;
      
      // Reset approval status when profile is updated
      therapist.isApproved = false;
      
      await therapist.save();
    } else {
      // Create new profile
      therapist = new Therapist({
        user: req.user._id,
        firstName,
        lastName,
        phone,
        email,
        address,
        specialization,
        experience,
        bio,
        pricePerSession,
        availability,
        isApproved: false // Default to not approved
      });
      
      await therapist.save();
    }

    res.status(200).json({ 
      message: "Profile saved successfully. Awaiting admin approval.", 
      therapist 
    });
  } catch (error) {
    console.error("Upsert therapist profile error:", error);
    res.status(500).json({ message: "Failed to save profile", error: error.message });
  }
};

// GET therapist's own profile
export const getMyProfile = async (req, res) => {
  try {
    const therapist = await Therapist.findOne({ user: req.user._id })
      .populate("user", "username email");

    if (!therapist) {
      return res.status(404).json({ message: "Therapist profile not found" });
    }

    res.status(200).json(therapist);
  } catch (error) {
    console.error("Get my profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
};

// ADD review to therapist
export const addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const therapistId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const therapist = await Therapist.findById(therapistId);
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }

    // Add review
    therapist.reviews.push({
      user: req.user._id,
      rating,
      review,
    });

    // Update average rating
    const totalRating = therapist.reviews.reduce((sum, review) => sum + review.rating, 0);
    therapist.averageRating = totalRating / therapist.reviews.length;
    therapist.totalReviews = therapist.reviews.length;

    await therapist.save();

    res.status(200).json({ message: "Review added successfully", therapist });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: "Failed to add review", error: error.message });
  }
};

// GET therapist reviews
export const getReviews = async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id)
      .populate("reviews.user", "username")
      .select("reviews");

    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }

    res.status(200).json(therapist.reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};

// GET therapist's patients and bookings
export const getMyPatientsAndBookings = async (req, res) => {
  try {
    // Find therapist record for current user
    const therapist = await Therapist.findOne({ user: req.user._id });
    if (!therapist) {
      return res.status(404).json({ message: "Therapist profile not found" });
    }

    // Get all bookings for this therapist
    const bookings = await Booking.find({ therapist: therapist._id })
      .populate("user", "username")
      .sort({ date: 1, time: 1 });

    // Extract unique patients
    const patientMap = {};
    bookings.forEach(booking => {
      if (booking.user && !patientMap[booking.user._id]) {
        patientMap[booking.user._id] = {
          _id: booking.user._id,
          username: booking.user.username,
          bookings: []
        };
      }
      if (booking.user) {
        patientMap[booking.user._id].bookings.push({
          _id: booking._id,
          date: booking.date,
          time: booking.time,
          notes: booking.notes,
          status: booking.status,
          createdAt: booking.createdAt
        });
      }
    });

    const patients = Object.values(patientMap);

    res.status(200).json({
      patients,
      bookings
    });
  } catch (error) {
    console.error("Get patients and bookings error:", error);
    res.status(500).json({ message: "Failed to fetch patients and bookings", error: error.message });
  }
};

// ADMIN: Get all therapist profiles (approved and pending)
export const getAllTherapistProfiles = async (req, res) => {
  try {
    // Only admins can access this
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const therapists = await Therapist.find()
      .populate("user", "username email")
      .sort({ isApproved: 1, createdAt: -1 }); // Show pending first

    res.status(200).json(therapists);
  } catch (error) {
    console.error("Get all therapist profiles error:", error);
    res.status(500).json({ message: "Failed to fetch therapist profiles", error: error.message });
  }
};

// ADMIN: Approve therapist profile
export const approveTherapistProfile = async (req, res) => {
  try {
    // Only admins can access this
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { therapistId } = req.params;
    const therapist = await Therapist.findById(therapistId);

    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }

    therapist.isApproved = true;
    await therapist.save();

    // Also update the user's role to therapist if not already
    const user = await User.findById(therapist.user);
    if (user && user.role !== "therapist") {
      user.role = "therapist";
      await user.save();
    }

    res.status(200).json({ 
      message: "Therapist profile approved successfully", 
      therapist 
    });
  } catch (error) {
    console.error("Approve therapist profile error:", error);
    res.status(500).json({ message: "Failed to approve therapist profile", error: error.message });
  }
};
