import mongoose from "mongoose";

const ReflectionSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    date: { 
      type: String, 
      required: true 
    },

    content: {           // <-- THIS MUST EXIST (not text)
      type: String,
      required: true,
    },

    mood: {
      type: String,
      default: "Neutral",
    }
  },
  { timestamps: true }
);

export default mongoose.model("Reflection", ReflectionSchema);
