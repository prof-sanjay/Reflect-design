// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connection.js";

import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import wellnessRoutes from "./routes/wellnessRoutes.js";
import reflectionRoutes from "./routes/reflectionRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Debug
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API ROUTES
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/goals", goalRoutes);

// ⭐ wellness MUST come BEFORE reflections  
app.use("/api/wellness", wellnessRoutes);

// ⭐ reflection routes AFTER wellness
app.use("/api/reflections", reflectionRoutes);

app.use("/api/media", mediaRoutes);
app.use("/api/profile", profileRoutes);

app.use("/uploads", express.static("uploads"));

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at ${PORT}`));
