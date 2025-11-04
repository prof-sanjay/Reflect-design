import Task from "../models/taskModel.js";

// ✅ Get all tasks for logged-in user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("❌ Error fetching tasks:", error.message);
    res.status(500).json({ message: "Failed to get tasks" });
  }
};

// ✅ Create new task
export const createTask = async (req, res) => {
  try {
    const { text, totalDays, startDate, deadline } = req.body;

    if (!text || !totalDays || !startDate || !deadline) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const task = await Task.create({
      user: req.user._id,
      text,
      totalDays,
      startDate,
      deadline,
      lastUpdated: new Date(),
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("❌ Error creating task:", error.message);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// ✅ Update task (only owner)
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    console.error("❌ Error updating task:", error.message);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// ✅ Delete task (only owner)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting task:", error.message);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
