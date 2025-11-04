// be/models/Reflection.js
import mongoose from "mongoose";

const reflectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Reflection content is required"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Reflection = mongoose.model("Reflection", reflectionSchema);
export default Reflection;
