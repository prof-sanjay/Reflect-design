import express from "express";
import Goal from "../models/Goal.js";

const router = express.Router();

/* ==============================
   ✅ GET all goals
================================= */
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 });
    res.status(200).json(goals);
  } catch (err) {
    console.error("❌ Error fetching goals:", err.message);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

/* ==============================
   ✅ CREATE new goal
================================= */
router.post("/", async (req, res) => {
  try {
    const { title, daysToComplete, deadline } = req.body;

    if (!title || !daysToComplete || !deadline) {
      return res
        .status(400)
        .json({ error: "Title, daysToComplete, and deadline are required." });
    }

    const newGoal = new Goal({
      title,
      daysToComplete,
      deadline,
      subgoals: [],
    });

    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    console.error("❌ Error creating goal:", err.message);
    res.status(500).json({ error: "Failed to create goal." });
  }
});

/* ==============================
   ✅ ADD subgoal to a goal
================================= */
router.post("/:id/subgoal", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Subgoal title is required." });
    }

    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ error: "Goal not found." });
    }

    goal.subgoals.push({ title });
    const updatedGoal = await goal.save();

    res.status(200).json(updatedGoal);
  } catch (err) {
    console.error("❌ Error adding subgoal:", err.message);
    res.status(500).json({ error: "Failed to add subgoal." });
  }
});

/* ==============================
   ✅ TOGGLE goal completion
================================= */
router.put("/:id/complete", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ error: "Goal not found." });
    }

    goal.completed = !goal.completed;
    const updatedGoal = await goal.save();

    res.status(200).json(updatedGoal);
  } catch (err) {
    console.error("❌ Error updating goal:", err.message);
    res.status(500).json({ error: "Failed to update goal." });
  }
});

/* ==============================
   ✅ DELETE goal
================================= */
router.delete("/:id", async (req, res) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id);
    if (!deletedGoal) {
      return res.status(404).json({ error: "Goal not found." });
    }

    res.status(200).json({ message: "Goal deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting goal:", err.message);
    res.status(500).json({ error: "Failed to delete goal." });
  }
});

export default router;
