import Reflection from "../models/Reflection.js";

/**
 * ✅ Get all reflections for logged-in user
 */
export const getReflections = async (req, res) => {
  try {
    const reflections = await Reflection.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(reflections);
  } catch (error) {
    console.error("❌ Error fetching reflections:", error.message);
    res.status(500).json({ message: "Failed to fetch reflections" });
  }
};

/**
 * ✅ Create new reflection for logged-in user
 */
export const createReflection = async (req, res) => {
  try {
    const { text, mood } = req.body;

    if (!text || !mood) {
      return res.status(400).json({ message: "Text and mood are required." });
    }

    const newReflection = new Reflection({
      user: req.user._id,
      text,
      mood,
      date: new Date(),
    });

    await newReflection.save();
    res.status(201).json(newReflection);
  } catch (error) {
    console.error("❌ Error creating reflection:", error.message);
    res.status(500).json({ message: "Failed to create reflection" });
  }
};

/**
 * ✅ Delete a reflection (optional)
 */
export const deleteReflection = async (req, res) => {
  try {
    const reflection = await Reflection.findById(req.params.id);
    if (!reflection) return res.status(404).json({ message: "Reflection not found" });
    if (reflection.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await reflection.deleteOne();
    res.json({ message: "Reflection deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting reflection:", error.message);
    res.status(500).json({ message: "Failed to delete reflection" });
  }
};
