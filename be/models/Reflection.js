// be/models/Reflection.js
import mongoose from "mongoose";

const reflectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    mood: {
      type: String,
      enum: ["happy", "sad", "anxious", "angry", "calm", "excited", "neutral"],
      required: true,
    },
    entry: {
      type: String,
      required: true,
    },
    gratitude: {
      type: String,
    },
    goals: {
      type: String,
    },
  },
  { timestamps: true }
);

// Index for faster queries
reflectionSchema.index({ user: 1, date: 1 });

const Reflection = mongoose.model("Reflection", reflectionSchema);

export default Reflection;
