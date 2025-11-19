// be/controllers/wellnessController.js
import Wellness from "../models/wellnessModel.js";

/* ================================
   FIXED → correct local date
================================ */
const getTodayString = () => {
  return new Date().toLocaleDateString("en-CA");  // yyyy-mm-dd LOCAL
};

/* ================================
   SAVE or UPDATE wellness for today
================================ */
export const saveWellnessData = async (req, res) => {
  try {
    const userId = req.user._id;
    const date = getTodayString();

    const existing = await Wellness.findOne({ user: userId, date });

    if (existing) {
      const updated = await Wellness.findOneAndUpdate(
        { user: userId, date },
        { ...req.body, date },
        { new: true }
      );
      return res.status(200).json(updated);
    }

    const created = await Wellness.create({
      ...req.body,
      user: userId,
      date,
    });

    return res.status(201).json(created);

  } catch (err) {
    console.error("❌ Error saving wellness:", err);
    return res.status(500).json({ message: "Failed to save wellness" });
  }
};

/* ================================
   GET today's wellness
================================ */
export const getWellnessData = async (req, res) => {
  try {
    const userId = req.user._id;
    const date = getTodayString();

    const data = await Wellness.findOne({ user: userId, date });
    return res.status(200).json(data || {});

  } catch (err) {
    console.error("❌ Error fetching wellness:", err);
    return res.status(500).json({ message: "Failed to fetch wellness" });
  }
};

/* ================================
   GET FULL WELLNESS HISTORY
================================ */
export const getWellnessHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const history = await Wellness.find({ user: userId }).sort({ date: 1 });

    return res.status(200).json(history);

  } catch (err) {
    console.error("❌ Error fetching history:", err);
    return res.status(500).json({ message: "Failed to fetch history" });
  }
};

