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
  { _id: false } // prevents automatic _id for each subgoal
);

// ✅ Main Goal Schema
const goalSchema = new mongoose.Schema(
  {
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
      min: [1, "Days to complete must be at least 1"],
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

// ✅ Export model
const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
