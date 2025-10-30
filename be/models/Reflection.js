import mongoose from "mongoose";

const reflectionSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    default: "Neutral",
  },
});

const Reflection = mongoose.model("Reflection", reflectionSchema);
export default Reflection;
