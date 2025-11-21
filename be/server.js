// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./db/connection.js";

// ROUTES
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import wellnessRoutes from "./routes/wellnessRoutes.js";
import reflectionRoutes from "./routes/reflectionRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import therapistRoutes from "./routes/therapistRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
connectDB();

// EXPRESS + HTTP SERVER
const app = express();
const httpServer = createServer(app);

// SOCKET.IO SETUP
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5176",
      "http://localhost:5177",
      "http://localhost:5198"
    ],
    credentials: true,
  },
});

// --------- MIDDLEWARES ---------
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5176",
      "http://localhost:5177",
      "http://localhost:5198"
    ],
    credentials: true,
  })
);

// Debug logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// --------- API ROUTES ---------

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/goals", goalRoutes);

app.use("/api/wellness", wellnessRoutes);
app.use("/api/reflections", reflectionRoutes);

app.use("/api/media", mediaRoutes);
app.use("/api/profile", profileRoutes);

app.use("/api/habits", habitRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/therapist", therapistRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);

// File uploads static path
app.use("/uploads", express.static("uploads"));

// --------- SOCKET.IO EVENTS ---------
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-chat", ({ userId, therapistId }) => {
    const room = `chat-${userId}-${therapistId}`;
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("send-message", ({ room, message, sender }) => {
    io.to(room).emit("receive-message", {
      message,
      sender,
      timestamp: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// --------- 404 HANDLER ---------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// --------- START SERVER ---------
const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`🚀 Backend API running on http://localhost:${PORT}`);
  console.log(`⚡ Socket.IO running on http://localhost:${PORT}`);
});
