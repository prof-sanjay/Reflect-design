import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: { type: String, required: true },
    alias: { type: String },
    phone: { type: String, required: true },
    gender: { type: String, required: true },

    dob: { type: String, required: true },

    starSign: { type: String },

    // Journal Prompts (array of strings)
    prompts: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", ProfileSchema);
