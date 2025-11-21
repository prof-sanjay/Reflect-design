// be/controllers/reflectionController.js
import Reflection from "../models/Reflection.js";

// GET all reflections for logged-in user
export const getReflections = async (req, res) => {
  try {
    const reflections = await Reflection.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(90); // Last 3 months
    res.status(200).json(reflections);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reflections", error: error.message });
  }
};

// GET reflection for specific date
export const getReflectionByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const reflection = await Reflection.findOne({
      user: req.user._id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!reflection) {
      return res.status(404).json({ message: "No reflection found for this date" });
    }

    res.status(200).json(reflection);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reflection", error: error.message });
  }
};

// CREATE new reflection
export const createReflection = async (req, res) => {
  try {
    const { date, mood, entry, gratitude, goals } = req.body;

    console.log("Create reflection request:", { date, mood, entry, gratitude, goals, user: req.user._id });

    if (!date || !mood || !entry) {
      return res.status(400).json({ message: "Date, mood, and entry are required" });
    }

    const reflection = await Reflection.create({
      user: req.user._id,
      date: new Date(date),
      mood,
      entry,
      gratitude,
      goals,
    });

    console.log("Reflection created successfully:", reflection);
    res.status(201).json(reflection);
  } catch (error) {
    console.error("Create reflection error:", error);
    res.status(500).json({ message: "Failed to create reflection", error: error.message });
  }
};

// UPDATE reflection
export const updateReflection = async (req, res) => {
  try {
    const reflection = await Reflection.findById(req.params.id);

    if (!reflection) {
      return res.status(404).json({ message: "Reflection not found" });
    }

    if (reflection.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedReflection = await Reflection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedReflection);
  } catch (error) {
    res.status(500).json({ message: "Failed to update reflection", error: error.message });
  }
};

// DELETE reflection
export const deleteReflection = async (req, res) => {
  try {
    const reflection = await Reflection.findById(req.params.id);

    if (!reflection) {
      return res.status(404).json({ message: "Reflection not found" });
    }

    if (reflection.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await reflection.deleteOne();
    res.json({ message: "Reflection deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete reflection", error: error.message });
  }
};
