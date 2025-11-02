import Task from "../models/taskModel.js";

// ✅ Get all tasks for logged-in user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("❌ Error fetching tasks:", err.message);
    res.status(500).json({ message: "Failed to get tasks" });
  }
};

// ✅ Create a new task linked to logged-in user
export const createTask = async (req, res) => {
  try {
    const { text, completed, totalDays, currentDay, startDate, deadline, lastUpdated } = req.body;

    const task = await Task.create({
      user: req.user._id, // ✅ link to logged-in user
      text,
      completed,
      totalDays,
      currentDay,
      startDate,
      deadline,
      lastUpdated,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("❌ Error creating task:", err.message);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// ✅ Update task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating task:", err.message);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// ✅ Delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("❌ Error deleting task:", err.message);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
