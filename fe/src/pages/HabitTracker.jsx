// fe/src/pages/HabitTracker.jsx
import React, { useState, useEffect } from "react";
import { getHabits, createHabit, markHabitComplete, deleteHabit } from "../utils/api";
import "../styles/HabitTracker.css";

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    frequency: "daily",
    targetCount: 1,
    icon: "🎯",
    color: "#4ade80",
  });

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const data = await getHabits();
      setHabits(data);
    } catch (error) {
      console.error("Failed to load habits:", error);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    try {
      await createHabit(newHabit);
      setNewHabit({ name: "", frequency: "daily", targetCount: 1, icon: "🎯", color: "#4ade80" });
      setShowCreateForm(false);
      loadHabits();
    } catch (error) {
      console.error("Failed to create habit:", error);
    }
  };

  const handleMarkComplete = async (habitId) => {
    const today = new Date().toISOString().split("T")[0];
    try {
      await markHabitComplete(habitId, today);
      loadHabits();
    } catch (error) {
      console.error("Failed to mark habit complete:", error);
    }
  };

  const handleDelete = async (habitId) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      try {
        await deleteHabit(habitId);
        loadHabits();
      } catch (error) {
        console.error("Failed to delete habit:", error);
      }
    }
  };

  return (
    <div className="habit-tracker">
      <div className="habit-header">
        <h1>🎯 Habit Tracker</h1>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-create">
          + New Habit
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateHabit} className="habit-form">
          <input
            type="text"
            placeholder="Habit name"
            value={newHabit.name}
            onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
            required
          />
          <select
            value={newHabit.frequency}
            onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <input
            type="text"
            placeholder="Icon (emoji)"
            value={newHabit.icon}
            onChange={(e) => setNewHabit({ ...newHabit, icon: e.target.value })}
          />
          <input
            type="color"
            value={newHabit.color}
            onChange={(e) => setNewHabit({ ...newHabit, color: e.target.value })}
          />
          <button type="submit" className="btn-save">Create</button>
          <button type="button" onClick={() => setShowCreateForm(false)} className="btn-cancel">
            Cancel
          </button>
        </form>
      )}

      <div className="habits-grid">
        {habits.map((habit) => (
          <div key={habit._id} className="habit-card" style={{ borderLeft: `4px solid ${habit.color}` }}>
            <div className="habit-header-row">
              <span className="habit-icon">{habit.icon}</span>
              <h3>{habit.name}</h3>
              <button onClick={() => handleDelete(habit._id)} className="btn-delete">
                🗑️
              </button>
            </div>
            <div className="habit-stats">
              <div className="stat">
                <span className="stat-label">Current Streak</span>
                <span className="stat-value">🔥 {habit.currentStreak} days</span>
              </div>
              <div className="stat">
                <span className="stat-label">Longest Streak</span>
                <span className="stat-value">⭐ {habit.longestStreak} days</span>
              </div>
            </div>
            <button onClick={() => handleMarkComplete(habit._id)} className="btn-complete">
              ✓ Mark Today Complete
            </button>
          </div>
        ))}
      </div>

      {habits.length === 0 && !showCreateForm && (
        <div className="empty-state">
          <p>No habits yet. Create one to start tracking!</p>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;
