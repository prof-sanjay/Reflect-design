// be/models/Therapist.js
import mongoose from "mongoose";

const therapistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  specialization: {
    type: String,
    trim: true,
  },
  experience: {
    type: Number, // years of experience
  },
  bio: {
    type: String,
    trim: true,
  },
  pricePerSession: {
    type: Number,
    default: 50,
  },
  availability: {
    type: String,
    trim: true,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  isApproved: {
    type: Boolean,
    default: false, // Admin approval required
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }],
}, { timestamps: true });

// Index for faster queries
therapistSchema.index({ specialization: 1 });
therapistSchema.index({ averageRating: -1 });
therapistSchema.index({ isApproved: 1 });

const Therapist = mongoose.model("Therapist", therapistSchema);

export default Therapist;
