// be/models/Goal.js
import mongoose from "mongoose";

// ✅ Subgoal Schema
const subgoalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Subgoal title is required"],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

// ✅ Main Goal Schema
const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // linked to master table
    },
    title: {
      type: String,
      required: [true, "Goal title is required"],
      trim: true,
    },
    subgoals: {
      type: [subgoalSchema],
      default: [],
    },
    daysToComplete: {
      type: Number,
      required: [true, "Days to complete is required"],
      min: 1,
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
