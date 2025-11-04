// be/models/wellnessModel.js
import mongoose from "mongoose";

const wellnessSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hobbies: [String],
    sleepHours: Number,
    studyHours: Number,
    exerciseMinutes: Number,
    meditation: Boolean,
    reading: Boolean,
    hydration: Boolean,
    mood: String,
    stressLevel: Number,
    energyLevel: Number,
    waterIntake: Number,
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Wellness = mongoose.model("Wellness", wellnessSchema);
export default Wellness;
