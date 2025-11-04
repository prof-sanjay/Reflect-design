import mongoose from "mongoose";

/**
 * ⚙️ connectDB()
 * Establishes a MongoDB connection using Mongoose.
 * Falls back to a default URI if MONGO_URI is not provided in .env
 */
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI ||
      "mongodb+srv://bhuvan:bhuvan25@cluster0.r2uupym.mongodb.net/todoDB?retryWrites=true&w=majority";

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1); // Exit process if DB fails
  }
};

export default connectDB;
