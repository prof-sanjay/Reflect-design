import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connection.js"; // ✅ Database connection file
import taskRoutes from "./routes/taskRoutes.js"; // ✅ Task routes
import goalRoutes from "./routes/goalRoutes.js";
import reflectionRoutes from "./routes/reflectionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import wellnessRoutes from "./routes/wellnessRoutes.js";



// ✅ Load environment variables
dotenv.config();

// ✅ Initialize Express app
const app = express();

// ✅ Middleware setup
app.use(
  cors({
    origin: "http://localhost:5173", // React frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ Connect to MongoDB
connectDB();

// ✅ API Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/reflections", reflectionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wellness", wellnessRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 Reflect Todo Backend is Running Successfully");
});

// ✅ Invalid route handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
