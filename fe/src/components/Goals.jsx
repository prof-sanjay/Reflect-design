import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import "./Goals.css";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [daysToComplete, setDaysToComplete] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newSubgoal, setNewSubgoal] = useState("");

  // Add new goal
  const addGoal = () => {
    if (!newGoal.trim()) return alert("Please enter a goal!");
    if (!daysToComplete || isNaN(daysToComplete) || daysToComplete <= 0)
      return alert("Please enter a valid number of days greater than 0!");

    const today = new Date();
    const deadline = new Date(today);
    deadline.setDate(today.getDate() + Number(daysToComplete));

    const goal = {
      id: Date.now(),
      title: newGoal,
      subgoals: [],
      daysToComplete: Number(daysToComplete),
      deadline: deadline.toISOString(),
      completed: false,
    };

    setGoals([...goals, goal]);
    setNewGoal("");
    setDaysToComplete("");
  };

  // Select goal
  const selectGoal = (goalId) => {
    setSelectedGoal(goalId === selectedGoal ? null : goalId);
    setNewSubgoal("");
  };

  // Add subgoal
  const addSubgoal = (goalId) => {
    if (!newSubgoal.trim()) return alert("Please enter a subgoal!");
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId
        ? {
            ...goal,
            subgoals: [...goal.subgoals, { id: Date.now(), title: newSubgoal }],
          }
        : goal
    );
    setGoals(updatedGoals);
    setNewSubgoal("");
  };

  // Delete goal
  const deleteGoal = (goalId) => {
    const confirmed = window.confirm("Are you sure you want to delete this goal?");
    if (!confirmed) return;
    const updatedGoals = goals.filter((goal) => goal.id !== goalId);
    setGoals(updatedGoals);
    if (selectedGoal === goalId) setSelectedGoal(null);
  };

  // Mark goal as completed
  const toggleComplete = (goalId) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
  };

  // Calculate days left
  const getDaysLeft = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline);
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="goals-page">
      <Navbar />

      <div className="goals-container">
        <h1 className="goals-title">🎯 Your Goals</h1>

        {/* Add Goal */}
        <div className="add-goal-section">
          <input
            type="text"
            placeholder="Enter your new goal..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            className="goal-input"
          />
          <input
            type="number"
            placeholder="Days to complete"
            value={daysToComplete}
            onChange={(e) => setDaysToComplete(e.target.value)}
            className="days-input"
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
            goals.map((goal) => {
              const daysLeft = getDaysLeft(goal.deadline);
              const isReminder = daysLeft <= 2 && daysLeft > 0;
              const isOverdue = daysLeft < 0;

              return (
                <div
                  key={goal.id}
                  className={`goal-card ${isOverdue ? "overdue" : ""} ${
                    goal.completed ? "completed" : ""
                  }`}
                >
                  <div className="goal-header">
                    <div
                      className="goal-title-section"
                      onClick={() => selectGoal(goal.id)}
                    >
                      <span
                        className={`goal-title ${
                          goal.completed ? "strike-text" : ""
                        }`}
                      >
                        {goal.title}
                      </span>
                      <div className="goal-deadline">
                        🗓️ Deadline:{" "}
                        {new Date(goal.deadline).toLocaleDateString()} (
                        {goal.daysToComplete} days)
                      </div>
                    </div>

                    <div className="goal-actions">
                      {isReminder && !goal.completed && (
                        <span className="reminder-badge">
                          ⏰ {daysLeft} days left
                        </span>
                      )}
                      {isOverdue && !goal.completed && (
                        <span className="warning-badge">
                          ⚠️ Deadline passed!
                        </span>
                      )}

                      <button
                        className="tick-btn"
                        onClick={() => toggleComplete(goal.id)}
                      >
                        {goal.completed ? "✅" : "☐"}
                      </button>

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

                  {/* Subgoals */}
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Goals;
