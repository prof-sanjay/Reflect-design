import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ reference to User model
      required: true,
    },
    text: {
      type: String,
      required: [true, "Task text is required"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    totalDays: {
      type: Number,
      required: true,
    },
    currentDay: {
      type: Number,
      default: 1,
    },
    startDate: {
      type: String,
      required: true,
    },
    deadline: {
      type: String,
      required: true,
    },
    lastUpdated: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
