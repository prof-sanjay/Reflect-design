import Wellness from "../models/wellnessModel.js";

// ✅ Save or update wellness data
export const saveWellnessData = async (req, res) => {
  try {
    const userId = req.user._id;
    const existing = await Wellness.findOne({ user: userId });

    if (existing) {
      // update
      const updated = await Wellness.findOneAndUpdate(
        { user: userId },
        req.body,
        { new: true }
      );
      return res.status(200).json(updated);
    } else {
      // create new
      const created = await Wellness.create({ ...req.body, user: userId });
      return res.status(201).json(created);
    }
  } catch (err) {
    console.error("❌ Error saving wellness data:", err.message);
    res.status(500).json({ message: "Failed to save wellness data" });
  }
};

// ✅ Fetch logged-in user's wellness data
export const getWellnessData = async (req, res) => {
  try {
    const wellness = await Wellness.findOne({ user: req.user._id });
    res.status(200).json(wellness || {});
  } catch (err) {
    console.error("❌ Error fetching wellness data:", err.message);
    res.status(500).json({ message: "Failed to fetch wellness data" });
  }
};
