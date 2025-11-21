// be/models/Wellness.js
import mongoose from "mongoose";

const wellnessSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  sleepHours: {
    type: Number,
    default: 0,
  },
  studyHours: {
    type: Number,
    default: 0,
  },
  exerciseHours: {
    type: Number,
    default: 0,
  },
  habits: [{
    type: String,
  }],
  energyLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
  },
  stressLevel: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
  },
  mood: {
    type: String,
    enum: ["happy", "sad", "anxious", "angry", "calm", "excited", "neutral"],
    default: "neutral",
  },
  mentalHealth: {
    type: String,
    enum: ["excellent", "good", "fair", "poor", "crisis"],
    default: "good",
  },
  notes: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

// Index for faster queries
wellnessSchema.index({ user: 1, date: -1 });

const Wellness = mongoose.model("Wellness", wellnessSchema);

export default Wellness;