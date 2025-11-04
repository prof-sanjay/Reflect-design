import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connection.js";

// ✅ Import routes
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import wellnessRoutes from "./routes/wellnessRoutes.js";
import reflectionRoutes from "./routes/reflectionRoutes.js";

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

// ✅ Initialize Express app
const app = express();

// ✅ Global Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // safer for prod
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json()); // Parse JSON requests

// ✅ Log each request (optional, but great for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ✅ API Routes (Master + Transaction)
app.use("/api/users", userRoutes);        // Master table (User)
app.use("/api/tasks", taskRoutes);        // Transaction
app.use("/api/goals", goalRoutes);        // Transaction
app.use("/api/wellness", wellnessRoutes); // Transaction
app.use("/api/reflections", reflectionRoutes); // Transaction

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 Reflect Todo Backend is Running Successfully");
});

// ✅ Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
