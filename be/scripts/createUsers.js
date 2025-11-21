// be/scripts/createUsers.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  role: String,
  riskLevel: String,
  isActive: Boolean,
  lastActive: Date,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

const createUsers = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 
      "mongodb+srv://bhuvan:bhuvan25@cluster0.r2uupym.mongodb.net/todoDB?retryWrites=true&w=majority";

    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected");

    // Delete existing users (optional - comment out if you don't want to delete)
    // await User.deleteMany({});
    // console.log("🗑️  Existing users deleted");

    // Create Admin User
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = await User.create({
      username: "admin",
      password: adminPassword,
      email: "admin@mindfuljournal.com",
      role: "admin",
      riskLevel: "low",
      isActive: true,
      lastActive: new Date(),
    });
    console.log("✅ Admin created:", admin.username);

    // Create Regular User
    const userPassword = await bcrypt.hash("user123", 10);
    const user = await User.create({
      username: "user",
      password: userPassword,
      email: "user@mindfuljournal.com",
      role: "user",
      riskLevel: "low",
      isActive: true,
      lastActive: new Date(),
    });
    console.log("✅ User created:", user.username);

    // Create Therapist User
    const therapistPassword = await bcrypt.hash("therapist123", 10);
    const therapist = await User.create({
      username: "therapist",
      password: therapistPassword,
      email: "therapist@mindfuljournal.com",
      role: "therapist",
      riskLevel: "low",
      isActive: true,
      lastActive: new Date(),
    });
    console.log("✅ Therapist created:", therapist.username);

    console.log("\n🎉 All users created successfully!");
    console.log("\n📝 Login Credentials:");
    console.log("─────────────────────────────────────");
    console.log("ADMIN:");
    console.log("  Username: admin");
    console.log("  Password: admin123");
    console.log("─────────────────────────────────────");
    console.log("USER:");
    console.log("  Username: user");
    console.log("  Password: user123");
    console.log("─────────────────────────────────────");
    console.log("THERAPIST:");
    console.log("  Username: therapist");
    console.log("  Password: therapist123");
    console.log("─────────────────────────────────────\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createUsers();
