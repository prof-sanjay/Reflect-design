import express from "express";
import Reflection from "../models/Reflection.js";

const router = express.Router();

// ✅ Create a reflection
router.post("/", async (req, res) => {
  try {
    const { date, text, mood } = req.body;
    const newReflection = new Reflection({ date, text, mood });
    await newReflection.save();
    res.status(201).json({ message: "Reflection saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save reflection", error });
  }
});

// ✅ Get all reflections
router.get("/", async (req, res) => {
  try {
    const reflections = await Reflection.find().sort({ date: -1 });
    res.json(reflections);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reflections", error });
  }
});

export default router;
