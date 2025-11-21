// be/controllers/analyticsController.js
import Reflection from "../models/Reflection.js";
import Wellness from "../models/wellnessModel.js";
import User from "../models/userModel.js";

// Get weekly analytics for user
export const getWeeklyAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Get reflections for the week
    const reflections = await Reflection.find({
      user: userId,
      date: { $gte: weekAgo, $lte: today }
    });

    // Get wellness data
    const wellnessData = await Wellness.find({
      user: userId,
      date: { $gte: weekAgo, $lte: today }
    });

    // Mood distribution
    const moodCount = {};
    reflections.forEach(r => {
      moodCount[r.mood] = (moodCount[r.mood] || 0) + 1;
    });

    // Average wellness metrics
    const avgSleep = wellnessData.length > 0
      ? wellnessData.reduce((sum, w) => sum + (w.sleepHours || 0), 0) / wellnessData.length
      : 0;

    const avgEnergy = wellnessData.length > 0
      ? wellnessData.reduce((sum, w) => sum + (w.energyLevel || 0), 0) / wellnessData.length
      : 0;

    res.status(200).json({
      period: "week",
      reflectionCount: reflections.length,
      moodDistribution: moodCount,
      averageSleepHours: avgSleep.toFixed(1),
      averageEnergyLevel: avgEnergy.toFixed(1),
      wellnessEntries: wellnessData.length,
    });
  } catch (error) {
    console.error("Weekly analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get monthly analytics
export const getMonthlyAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const reflections = await Reflection.find({
      user: userId,
      date: { $gte: monthAgo, $lte: today }
    });

    const wellnessData = await Wellness.find({
      user: userId,
      date: { $gte: monthAgo, $lte: today }
    });

    // Mood trends over time
    const moodTrends = reflections.map(r => ({
      date: r.date,
      mood: r.mood
    }));

    // Most common moods
    const moodCount = {};
    reflections.forEach(r => {
      moodCount[r.mood] = (moodCount[r.mood] || 0) + 1;
    });

    res.status(200).json({
      period: "month",
      reflectionCount: reflections.length,
      moodDistribution: moodCount,
      moodTrends,
      wellnessEntries: wellnessData.length,
      consistency: ((reflections.length / 30) * 100).toFixed(1) + "%",
    });
  } catch (error) {
    console.error("Monthly analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin analytics - DAU, total users, mood distribution
export const getAdminAnalytics = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Daily active users (users with lastActive today)
    const dau = await User.countDocuments({
      lastActive: { 
        $gte: new Date(today),
        $lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000)
      }
    });

    // Total users
    const totalUsers = await User.countDocuments({ isActive: true });

    // Reflections today
    const startOfDay = new Date(today);
    const endOfDay = new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000);
    
    const reflectionsToday = await Reflection.countDocuments({
      date: { 
        $gte: startOfDay,
        $lt: endOfDay
      }
    });

    // Mood distribution (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentReflections = await Reflection.find({
      date: { $gte: weekAgo }
    });

    const moodDist = {};
    recentReflections.forEach(r => {
      if (r.mood) {  // Only count reflections that have a mood
        moodDist[r.mood] = (moodDist[r.mood] || 0) + 1;
      }
    });

    res.status(200).json({
      dailyActiveUsers: dau,
      totalUsers,
      reflectionsToday,
      moodDistribution: moodDist,
      avgReflectionsPerUser: totalUsers > 0 ? (reflectionsToday / totalUsers).toFixed(2) : "0.00",
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
