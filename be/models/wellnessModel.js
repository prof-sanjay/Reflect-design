// be/models/wellnessModel.js
import mongoose from "mongoose";

const wellnessSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Store as YYYY-MM-DD string
    date: {
      type: String,
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
  },
  { timestamps: true }
);

const Wellness = mongoose.model("Wellness", wellnessSchema);
export default Wellness;
