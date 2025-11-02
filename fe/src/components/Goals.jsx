import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar.jsx";
import "./Goals.css";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [daysToComplete, setDaysToComplete] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newSubgoal, setNewSubgoal] = useState("");

  // 🆕 States for editing
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editedGoalTitle, setEditedGoalTitle] = useState("");
  const [editedDays, setEditedDays] = useState("");

  const API_URL = "http://localhost:5000/api/goals";

  /* =====================================
     ✅ FETCH all goals
  ====================================== */
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await axios.get(API_URL);
      setGoals(res.data);
    } catch (err) {
      console.error("❌ Error fetching goals:", err);
      alert("Failed to fetch goals");
    }
  };

  /* =====================================
     ✅ ADD new goal
  ====================================== */
  const addGoal = async () => {
    if (!newGoal.trim()) return alert("Please enter a goal!");
    if (!daysToComplete || isNaN(daysToComplete) || daysToComplete <= 0)
      return alert("Please enter valid days > 0!");

    const today = new Date();
    const deadline = new Date(today);
    deadline.setDate(today.getDate() + Number(daysToComplete));

    try {
      const res = await axios.post(API_URL, {
        title: newGoal,
        daysToComplete: Number(daysToComplete),
        deadline: deadline.toISOString(),
      });

      setGoals([res.data, ...goals]);
      setNewGoal("");
      setDaysToComplete("");
    } catch (err) {
      console.error("❌ Error adding goal:", err);
      alert("Failed to add goal");
    }
  };

  /* =====================================
     ✅ ADD subgoal
  ====================================== */
  const addSubgoal = async (goalId) => {
    if (!newSubgoal.trim()) return alert("Please enter a subgoal!");

    try {
      const res = await axios.post(`${API_URL}/${goalId}/subgoal`, {
        title: newSubgoal,
      });
      setGoals(goals.map((goal) => (goal._id === goalId ? res.data : goal)));
      setNewSubgoal("");
    } catch (err) {
      console.error("❌ Error adding subgoal:", err);
      alert("Failed to add subgoal");
    }
  };

  /* =====================================
     ✅ TOGGLE goal completion
  ====================================== */
  const toggleComplete = async (goalId) => {
    try {
      const res = await axios.put(`${API_URL}/${goalId}/complete`);
      setGoals(goals.map((goal) => (goal._id === goalId ? res.data : goal)));
    } catch (err) {
      console.error("❌ Error toggling goal:", err);
      alert("Failed to update goal status");
    }
  };

  /* =====================================
     ✅ DELETE goal
  ====================================== */
  const deleteGoal = async (goalId) => {
    const confirmed = window.confirm("Are you sure you want to delete this goal?");
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/${goalId}`);
      setGoals(goals.filter((goal) => goal._id !== goalId));
    } catch (err) {
      console.error("❌ Error deleting goal:", err);
      alert("Failed to delete goal");
    }
  };

  /* =====================================
     ✅ SELECT goal (expand for subgoals)
  ====================================== */
  const selectGoal = (goalId) => {
    setSelectedGoal(goalId === selectedGoal ? null : goalId);
    setNewSubgoal("");
  };

  /* =====================================
     ✅ CALCULATE days left
  ====================================== */
  const getDaysLeft = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline);
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  /* =====================================
     🆕 EDIT goal
  ====================================== */
  const startEditing = (goal) => {
    setEditingGoalId(goal._id);
    setEditedGoalTitle(goal.title);
    setEditedDays(goal.daysToComplete);
  };

  const cancelEdit = () => {
    setEditingGoalId(null);
    setEditedGoalTitle("");
    setEditedDays("");
  };

  const saveEditedGoal = async (goalId) => {
    if (!editedGoalTitle.trim()) return alert("Goal title cannot be empty!");
    if (!editedDays || isNaN(editedDays) || editedDays <= 0)
      return alert("Please enter valid days > 0!");

    const today = new Date();
    const newDeadline = new Date(today);
    newDeadline.setDate(today.getDate() + Number(editedDays));

    try {
      const res = await axios.put(`${API_URL}/${goalId}`, {
        title: editedGoalTitle,
        daysToComplete: Number(editedDays),
        deadline: newDeadline.toISOString(),
      });

      setGoals(goals.map((goal) => (goal._id === goalId ? res.data : goal)));
      cancelEdit();
    } catch (err) {
      console.error("❌ Error editing goal:", err);
      alert("Failed to edit goal");
    }
  };

  /* =====================================
     ✅ UI Rendering
  ====================================== */
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

              const isEditing = editingGoalId === goal._id;

              return (
                <div
                  key={goal._id}
                  className={`goal-card ${isOverdue ? "overdue" : ""} ${
                    goal.completed ? "completed" : ""
                  }`}
                >
                  <div className="goal-header">
                    <div
                      className="goal-title-section"
                      onClick={() => selectGoal(goal._id)}
                    >
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={editedGoalTitle}
                            onChange={(e) => setEditedGoalTitle(e.target.value)}
                            className="goal-input"
                          />
                          <input
                            type="number"
                            value={editedDays}
                            onChange={(e) => setEditedDays(e.target.value)}
                            className="days-input"
                            placeholder="Days"
                          />
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
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

                      {/* ✅ Tick Button */}
                      <button
                        className="tick-btn"
                        onClick={() => toggleComplete(goal._id)}
                      >
                        {goal.completed ? "✅" : "☐"}
                      </button>

                      {/* 🆕 Edit & Save Buttons */}
                      {isEditing ? (
                        <>
                          <button
                            className="goal-btn"
                            onClick={() => saveEditedGoal(goal._id)}
                          >
                            💾 Save
                          </button>
                          <button
                            className="delete-btn"
                            onClick={cancelEdit}
                          >
                            ✖ Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          className="edit-btn"
                          onClick={() => startEditing(goal)}
                        >
                          Edit
                        </button>
                      )}

                      {/* Delete Button */}
                    <button className="delete-btn" onClick={() => deleteTask(t._id)}>Delete</button>

                    </div>
                  </div>

                  {/* Subgoals */}
                  {selectedGoal === goal._id && (
                    <div className="subgoal-section">
                      <ul>
                        {goal.subgoals.map((sub, index) => (
                          <li key={index}>{sub.title}</li>
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
                          onClick={() => addSubgoal(goal._id)}
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
