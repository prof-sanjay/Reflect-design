import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    totalDays: { type: Number },
    currentDay: { type: Number, default: 1 },
    startDate: { type: String },
    deadline: { type: String },
    lastUpdated: { type: String },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
