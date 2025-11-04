import mongoose from "mongoose";

const wellnessSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ Link to logged-in user
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
