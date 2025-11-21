// be/scripts/createSampleTherapists.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import Therapist from "../models/Therapist.js";

dotenv.config();

const sampleTherapists = [
  {
    username: "dr_smith",
    password: "therapist123",
    email: "smith@therapy.com",
    specialization: "Cognitive Behavioral Therapy",
    bio: "Specialized in anxiety and depression treatment with 10+ years of experience.",
    address: "123 Wellness St, New York, NY",
    pricePerSession: 120,
    availability: "Mon-Fri 9am-5pm",
  },
  {
    username: "dr_johnson",
    password: "therapist123",
    email: "johnson@therapy.com",
    specialization: "Family Therapy",
    bio: "Helping families navigate challenges and improve communication for 8 years.",
    address: "456 Harmony Ave, Los Angeles, CA",
    pricePerSession: 150,
    availability: "Tue-Thu 10am-6pm",
  },
  {
    username: "dr_williams",
    password: "therapist123",
    email: "williams@therapy.com",
    specialization: "Trauma Therapy",
    bio: "Certified trauma specialist focusing on PTSD and recovery. 12 years of experience.",
    address: "789 Healing Blvd, Chicago, IL",
    pricePerSession: 180,
    availability: "Mon-Wed-Fri 8am-4pm",
  },
  {
    username: "dr_brown",
    password: "therapist123",
    email: "brown@therapy.com",
    specialization: "Child Psychology",
    bio: "Specializing in child development and behavioral issues. 6 years of experience.",
    address: "321 Growth Rd, Miami, FL",
    pricePerSession: 140,
    availability: "Mon-Thu 11am-7pm",
  },
  {
    username: "dr_davis",
    password: "therapist123",
    email: "davis@therapy.com",
    specialization: "Marriage Counseling",
    bio: "Helping couples build stronger relationships through effective communication techniques.",
    address: "654 Love Ln, Seattle, WA",
    pricePerSession: 160,
    availability: "Wed-Sat 9am-5pm",
  },
];

const createSampleTherapists = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 
      "mongodb+srv://bhuvan:bhuvan25@cluster0.r2uupym.mongodb.net/todoDB?retryWrites=true&w=majority";

    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB Connected");

    // Clear existing therapist users
    await User.deleteMany({ role: "therapist" });
    console.log("🗑️  Existing therapists deleted");

    // Create sample therapists
    for (const therapistData of sampleTherapists) {
      // Create user account
      const hashedPassword = await bcrypt.hash(therapistData.password, 10);
      const user = await User.create({
        username: therapistData.username,
        password: hashedPassword,
        email: therapistData.email,
        role: "therapist",
        riskLevel: "low",
        isActive: true,
        lastActive: new Date(),
      });

      // Create therapist profile
      await Therapist.create({
        user: user._id,
        specialization: therapistData.specialization,
        bio: therapistData.bio,
        address: therapistData.address,
        pricePerSession: therapistData.pricePerSession,
        availability: therapistData.availability,
        averageRating: 0,
        totalReviews: 0,
      });

      console.log(`✅ Created therapist: ${therapistData.username}`);
    }

    console.log("\n🎉 Sample therapists created successfully!");
    console.log("\n📝 Therapist Credentials:");
    console.log("─────────────────────────────────────");
    sampleTherapists.forEach(therapist => {
      console.log(`${therapist.username}: therapist123`);
    });
    console.log("─────────────────────────────────────\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createSampleTherapists();
