import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import "./Goals.css";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newSubgoal, setNewSubgoal] = useState("");

  // Add new goal
  const addGoal = () => {
    if (!newGoal.trim()) return alert("Please enter a goal!");
    const goal = { id: Date.now(), title: newGoal, subgoals: [] };
    setGoals([...goals, goal]);
    setNewGoal("");
  };

  // Select a goal to add subgoals
  const selectGoal = (goalId) => {
    setSelectedGoal(goalId === selectedGoal ? null : goalId);
    setNewSubgoal("");
  };

  // Add subgoal to a specific goal
  const addSubgoal = (goalId) => {
    if (!newSubgoal.trim()) return alert("Please enter a subgoal!");
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId
        ? {
            ...goal,
            subgoals: [
              ...goal.subgoals,
              { id: Date.now(), title: newSubgoal },
            ],
          }
        : goal
    );
    setGoals(updatedGoals);
    setNewSubgoal("");
  };

  // ❌ Delete goal
  const deleteGoal = (goalId) => {
    const confirmed = window.confirm("Are you sure you want to delete this goal?");
    if (!confirmed) return;
    const updatedGoals = goals.filter((goal) => goal.id !== goalId);
    setGoals(updatedGoals);
    if (selectedGoal === goalId) setSelectedGoal(null);
  };

  return (
    <div className="goals-page">
      <Navbar />

      <div className="goals-container">
        <h1 className="goals-title">🎯 Your Goals</h1>

        {/* Add Goal Section */}
        <div className="add-goal-section">
          <input
            type="text"
            placeholder="Enter your new goal..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="goal-input"
          />
          <button className="goal-btn" onClick={addGoal}>
            ➕ Add Goal
          </button>
        </div>

        {/* Goals List */}
        <div className="goals-list">
          {goals.length === 0 ? (
            <p className="no-goals">No goals added yet. Start your journey!</p>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className="goal-card">
                <div className="goal-header">
                  <span onClick={() => selectGoal(goal.id)} className="goal-title">
                    {goal.title}
                  </span>
                  <div className="goal-actions">
                    <span
                      className="expand-icon"
                      onClick={() => selectGoal(goal.id)}
                    >
                      {selectedGoal === goal.id ? "🔽" : "▶️"}
                    </span>
                    <button
                      className="delete-btn"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      ✖️
                    </button>
                  </div>
                </div>

                {/* Subgoals Section */}
                {selectedGoal === goal.id && (
                  <div className="subgoal-section">
                    <ul>
                      {goal.subgoals.map((sub) => (
                        <li key={sub.id}>• {sub.title}</li>
                      ))}
                    </ul>

                    <div className="add-subgoal">
                      <input
                        type="text"
                        placeholder="Add a subgoal..."
                        value={newSubgoal}
                        onChange={(e) => setNewSubgoal(e.target.value)}
                        className="subgoal-input"
                      />
                      <button
                        className="subgoal-btn"
                        onClick={() => addSubgoal(goal.id)}
                      >
                        ➕ Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;
