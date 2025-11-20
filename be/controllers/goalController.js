import Goal from "../models/Goal.js";

// GET all goals
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch goals" });
  }
};

// CREATE goal
export const createGoal = async (req, res) => {
  try {
    const { title, description, category, priority, deadline, status } = req.body;

    if (!title || !description || !category || !deadline) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const goal = await Goal.create({
      user: req.user._id,
      title,
      description,
      category,
      priority,
      deadline,
      status,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: "Failed to create goal" });
  }
};

// UPDATE goal
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: "Failed to update goal" });
  }
};

// DELETE goal
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await goal.deleteOne();
    res.json({ message: "Goal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete goal" });
  }
};
