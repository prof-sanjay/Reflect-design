// be/models/Prompt.js
import mongoose from "mongoose";

const promptSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["morning", "evening", "general", "gratitude", "anxiety", "growth"],
      default: "general",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Prompt", promptSchema);
