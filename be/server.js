import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Journal from "./models/Journal.js"; // ← Import the Journal model

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/reflectDB")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Reflect Backend Running ✅");
});

// ✅ Save a new journal entry
app.post("/api/journals", async (req, res) => {
  try {
    const { text, mood, date } = req.body; // match frontend fields
    const newJournal = new Journal({ text, mood, date });
    await newJournal.save();
    res.status(201).json(newJournal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fetch all journal entries
app.get("/api/journals", async (req, res) => {
  try {
    const journals = await Journal.find().sort({ date: -1 }); // latest first
    res.json(journals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
