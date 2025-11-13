import Reflection from "../models/Reflection.js";

/* ============================================================
   CREATE or UPDATE Reflection
============================================================ */
export const saveReflection = async (req, res) => {
  try {
    const { date, content, mood } = req.body;

    if (!date || !content) {
      return res.status(400).json({ message: "Date and content are required" });
    }

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userId = req.user._id;

    // Check if reflection exists for this user + date
    let reflection = await Reflection.findOne({ user: userId, date });

    if (reflection) {
      reflection.content = content;
      reflection.mood = mood;
      await reflection.save();

      return res.status(200).json({
        message: "Reflection updated successfully",
        reflection,
      });
    }

    // Create new reflection
    const newReflection = await Reflection.create({
      user: userId,
      date,
      content,
      mood,
    });

    return res.status(201).json({
      message: "Reflection created successfully",
      reflection: newReflection,
    });

  } catch (error) {
    console.log("Reflection error:", error);
    res.status(500).json({ message: "Server error while saving reflection" });
  }
};



/* ============================================================
   GET Reflection by Date
============================================================ */
export const getReflectionByDate = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userId = req.user._id;
    const { date } = req.params;

    const reflection = await Reflection.findOne({ user: userId, date });

    if (!reflection) {
      return res.status(404).json({ message: "No reflection found for this date" });
    }

    return res.status(200).json(reflection);

  } catch (error) {
    console.log("Get reflection error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



/* ============================================================
   GET ALL Reflections (with STRING-BASED Filters)
============================================================ */
export const getAllReflections = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userId = req.user._id;
    let { fromDate, toDate, mood } = req.query;

    console.log("RAW QUERY RECEIVED:", req.query);

    const filter = { user: userId };

    /* ---------------------------------------------------------
       ⭐ DATE FILTER — WORKS WITH STRING DATES LIKE "2025-11-03"
    --------------------------------------------------------- */
    if (fromDate || toDate) {
      filter.date = {};

      if (fromDate) filter.date.$gte = fromDate.trim();
      if (toDate) filter.date.$lte = toDate.trim();
    }

    /* ---------------------------------------------------------
       ⭐ MOOD FILTER — EXACT MATCH
    --------------------------------------------------------- */
    if (mood && mood !== "all") {
      filter.mood = mood.trim();
    }

    console.log("FINAL FILTER APPLIED:", filter);

    /* Fetch sorted reflections */
    const reflections = await Reflection.find(filter).sort({ date: 1 });

    return res.status(200).json(reflections);

  } catch (error) {
    console.log("Fetch reflections error:", error);
    res.status(500).json({ message: "Server error fetching reflections" });
  }
};
