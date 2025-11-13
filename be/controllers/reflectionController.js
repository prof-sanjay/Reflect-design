import Reflection from "../models/Reflection.js";

// CREATE or UPDATE reflection
export const saveReflection = async (req, res) => {
  try {
    const { date, content, mood } = req.body;

    if (!date || !content) {
      return res.status(400).json({ message: "Date and content are required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    const userId = req.user._id;

    let reflection = await Reflection.findOne({ user: userId, date });

    if (reflection) {
      reflection.content = content;
      reflection.mood = mood;
      await reflection.save();

      return res.status(200).json({
        message: "Reflection updated",
        reflection,
      });
    }

    const newReflection = await Reflection.create({
      user: userId,
      date,
      content,
      mood,
    });

    return res.status(201).json({
      message: "Reflection created",
      reflection: newReflection,
    });

  } catch (error) {
    console.log("Reflection error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET reflection by date  <-- THIS FIXES THE IMPORT ERROR
export const getReflectionByDate = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const { date } = req.params;

    const reflection = await Reflection.findOne({ user: userId, date });

    if (!reflection) {
      return res.status(404).json({ message: "No reflection found" });
    }

    return res.status(200).json(reflection);

  } catch (error) {
    console.log("Fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
