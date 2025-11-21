// be/models/Habit.js
import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "daily",
    },
    targetCount: {
      type: Number,
      default: 1,
    },
    icon: {
      type: String,
      default: "🎯",
    },
    color: {
      type: String,
      default: "#4ade80",
    },
    completedDates: [{
      type: String, // YYYY-MM-DD format
    }],
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);
