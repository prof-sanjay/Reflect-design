// be/controllers/habitController.js
import Habit from "../models/Habit.js";

// Create new habit
export const createHabit = async (req, res) => {
  try {
    const { name, frequency, targetCount, icon, color } = req.body;
    const userId = req.user._id;

    const habit = await Habit.create({
      user: userId,
      name,
      frequency,
      targetCount,
      icon,
      color,
    });

    res.status(201).json({ message: "Habit created successfully", habit });
  } catch (error) {
    console.error("Create habit error:", error);
    res.status(500).json({ message: "Server error creating habit" });
  }
};

// Get all habits for user
export const getHabits = async (req, res) => {
  try {
    const userId = req.user._id;
    const habits = await Habit.find({ user: userId, isActive: true });
    res.status(200).json(habits);
  } catch (error) {
    console.error("Get habits error:", error);
    res.status(500).json({ message: "Server error fetching habits" });
  }
};

// Mark habit as completed for a date
export const markHabitComplete = async (req, res) => {
  try {
    const { habitId } = req.params;
    const { date } = req.body; // YYYY-MM-DD format
    const userId = req.user._id;

    const habit = await Habit.findOne({ _id: habitId, user: userId });
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // Add date if not already completed
    if (!habit.completedDates.includes(date)) {
      habit.completedDates.push(date);
      
      // Calculate streak
      const sortedDates = habit.completedDates.sort();
      let currentStreak = 1;
      
      for (let i = sortedDates.length - 1; i > 0; i--) {
        const current = new Date(sortedDates[i]);
        const previous = new Date(sortedDates[i - 1]);
        const diffDays = (current - previous) / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
      
      habit.currentStreak = currentStreak;
      if (currentStreak > habit.longestStreak) {
        habit.longestStreak = currentStreak;
      }
      
      await habit.save();
    }

    res.status(200).json({ message: "Habit marked complete", habit });
  } catch (error) {
    console.error("Mark habit complete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update habit
export const updateHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user._id;
    const updates = req.body;

    const habit = await Habit.findOneAndUpdate(
      { _id: habitId, user: userId },
      updates,
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json({ message: "Habit updated", habit });
  } catch (error) {
    console.error("Update habit error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete habit
export const deleteHabit = async (req, res) => {
  try {
    const { habitId } = req.params;
    const userId = req.user._id;

    const habit = await Habit.findOneAndUpdate(
      { _id: habitId, user: userId },
      { isActive: false },
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error("Delete habit error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get habit statistics
export const getHabitStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const habits = await Habit.find({ user: userId, isActive: true });

    const stats = habits.map(habit => ({
      id: habit._id,
      name: habit.name,
      currentStreak: habit.currentStreak,
      longestStreak: habit.longestStreak,
      totalCompletions: habit.completedDates.length,
      completionRate: habit.completedDates.length > 0 
        ? ((habit.completedDates.length / 30) * 100).toFixed(1) 
        : 0,
    }));

    res.status(200).json(stats);
  } catch (error) {
    console.error("Get habit stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
