import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./models/Task.js"; // ✅ Import the model
import goalRoutes from "./routes/goalRoutes.js";
import reflectionRoutes from "./routes/reflectionRoutes.js";





dotenv.config();

const app = express();

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:5173", // React app URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/api/goals", goalRoutes);
app.use("/api/reflections", reflectionRoutes);


// ✅ MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb+srv://bhuvan:bhuvan25@cluster0.r2uupym.mongodb.net/todoDB?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
connectDB();

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 Reflect Todo Backend is Running Successfully");
});


// ✅ Get all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// ✅ Add new task
app.post("/api/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to add task" });
  }
});

// ✅ Update task
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// ✅ Delete task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// ✅ Invalid route handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
