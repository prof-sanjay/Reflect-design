// be/controllers/wellnessController.js
import Wellness from "../models/wellnessModel.js";

// CREATE new wellness entry
export const createWellnessEntry = async (req, res) => {
  try {
    const {
      date,
      sleepHours,
      studyHours,
      exerciseHours,
      habits,
      energyLevel,
      stressLevel,
      mood,
      mentalHealth,
      notes
    } = req.body;

    // Check if entry already exists for this date
    let existingEntry = await Wellness.findOne({
      user: req.user._id,
      date: new Date(date)
    });

    // If entry exists, update it instead of creating a new one
    if (existingEntry) {
      existingEntry = await Wellness.findOneAndUpdate(
        { _id: existingEntry._id, user: req.user._id },
        {
          sleepHours: parseFloat(sleepHours) || 0,
          studyHours: parseFloat(studyHours) || 0,
          exerciseHours: parseFloat(exerciseHours) || 0,
          habits: habits || [],
          energyLevel: parseInt(energyLevel) || 5,
          stressLevel: parseInt(stressLevel) || 5,
          mood: mood || "neutral",
          mentalHealth: mentalHealth || "good",
          notes: notes || ""
        },
        { new: true, runValidators: true }
      );
      
      return res.status(200).json(existingEntry);
    }

    const wellness = await Wellness.create({
      user: req.user._id,
      date: new Date(date),
      sleepHours: parseFloat(sleepHours) || 0,
      studyHours: parseFloat(studyHours) || 0,
      exerciseHours: parseFloat(exerciseHours) || 0,
      habits: habits || [],
      energyLevel: parseInt(energyLevel) || 5,
      stressLevel: parseInt(stressLevel) || 5,
      mood: mood || "neutral",
      mentalHealth: mentalHealth || "good",
      notes: notes || ""
    });

    res.status(201).json(wellness);
  } catch (error) {
    console.error("Create wellness entry error:", error);
    res.status(500).json({ message: "Failed to create wellness entry", error: error.message });
  }
};

// GET wellness entries for user
export const getWellnessEntries = async (req, res) => {
  try {
    const { limit = 30, startDate, endDate } = req.query;
    
    let query = { user: req.user._id };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const entries = await Wellness.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.status(200).json(entries);
  } catch (error) {
    console.error("Get wellness entries error:", error);
    res.status(500).json({ message: "Failed to fetch wellness entries", error: error.message });
  }
};

// GET wellness entry by date
export const getWellnessEntryByDate = async (req, res) => {
  try {
    const { date } = req.params;
    
    const entry = await Wellness.findOne({
      user: req.user._id,
      date: new Date(date)
    });

    if (!entry) {
      return res.status(404).json({ message: "Wellness entry not found for this date" });
    }

    res.status(200).json(entry);
  } catch (error) {
    console.error("Get wellness entry error:", error);
    res.status(500).json({ message: "Failed to fetch wellness entry", error: error.message });
  }
};

// UPDATE wellness entry
export const updateWellnessEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sleepHours,
      studyHours,
      exerciseHours,
      habits,
      energyLevel,
      stressLevel,
      mood,
      mentalHealth,
      notes
    } = req.body;

    const entry = await Wellness.findOneAndUpdate(
      { _id: id, user: req.user._id },
      {
        sleepHours: parseFloat(sleepHours) || 0,
        studyHours: parseFloat(studyHours) || 0,
        exerciseHours: parseFloat(exerciseHours) || 0,
        habits: habits || [],
        energyLevel: parseInt(energyLevel) || 5,
        stressLevel: parseInt(stressLevel) || 5,
        mood: mood || "neutral",
        mentalHealth: mentalHealth || "good",
        notes: notes || ""
      },
      { new: true, runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ message: "Wellness entry not found" });
    }

    res.status(200).json(entry);
  } catch (error) {
    console.error("Update wellness entry error:", error);
    res.status(500).json({ message: "Failed to update wellness entry", error: error.message });
  }
};

// DELETE wellness entry
export const deleteWellnessEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await Wellness.findOneAndDelete({
      _id: id,
      user: req.user._id
    });

    if (!entry) {
      return res.status(404).json({ message: "Wellness entry not found" });
    }

    res.status(200).json({ message: "Wellness entry deleted successfully" });
  } catch (error) {
    console.error("Delete wellness entry error:", error);
    res.status(500).json({ message: "Failed to delete wellness entry", error: error.message });
  }
};

// GET wellness statistics
export const getWellnessStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const entries = await Wellness.find({
      user: req.user._id,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    if (entries.length === 0) {
      return res.status(200).json({
        averageSleep: 0,
        averageStudy: 0,
        averageExercise: 0,
        averageEnergy: 0,
        averageStress: 0,
        moodDistribution: {},
        entriesCount: 0
      });
    }

    // Calculate averages
    const totalSleep = entries.reduce((sum, entry) => sum + entry.sleepHours, 0);
    const totalStudy = entries.reduce((sum, entry) => sum + entry.studyHours, 0);
    const totalExercise = entries.reduce((sum, entry) => sum + entry.exerciseHours, 0);
    const totalEnergy = entries.reduce((sum, entry) => sum + entry.energyLevel, 0);
    const totalStress = entries.reduce((sum, entry) => sum + entry.stressLevel, 0);
    
    // Calculate mood distribution
    const moodDistribution = {};
    entries.forEach(entry => {
      moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1;
    });

    res.status(200).json({
      averageSleep: (totalSleep / entries.length).toFixed(1),
      averageStudy: (totalStudy / entries.length).toFixed(1),
      averageExercise: (totalExercise / entries.length).toFixed(1),
      averageEnergy: (totalEnergy / entries.length).toFixed(1),
      averageStress: (totalStress / entries.length).toFixed(1),
      moodDistribution,
      entriesCount: entries.length
    });
  } catch (error) {
    console.error("Get wellness stats error:", error);
    res.status(500).json({ message: "Failed to fetch wellness statistics", error: error.message });
  }
};