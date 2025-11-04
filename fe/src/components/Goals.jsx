import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import "./Goals.css";

/**
 * ✅ Base API URL (read from .env or fallback)
 */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * 🔐 Logout helper for expired sessions
 */
const handleLogout = () => {
  localStorage.clear();
  alert("Session expired. Please log in again.");
  window.location.href = "/";
};

/**
 * 🌐 Custom Fetch with Authorization Header
 */
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  if (!token) return handleLogout();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) handleLogout();
  return res;
};

/**
 * 🎯 Goals Component
 */
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

  /* =====================================
     ✅ Fetch all goals
  ====================================== */
  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await apiFetch("/goals", { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch goals");
      const data = await res.json();
      setGoals(data);
    } catch (err) {
      console.error("❌ Error fetching goals:", err.message);
      alert("Failed to fetch goals.");
    }
  };

  /* =====================================
     ✅ Add new goal
  ====================================== */
  const addGoal = async () => {
    if (!newGoal.trim()) return alert("Please enter a goal!");
    if (!daysToComplete || isNaN(daysToComplete) || daysToComplete <= 0)
      return alert("Please enter valid days > 0!");

    const today = new Date();
    const deadline = new Date(today);
    deadline.setDate(today.getDate() + Number(daysToComplete));

    try {
      const res = await apiFetch("/goals", {
        method: "POST",
        body: JSON.stringify({
          title: newGoal,
          daysToComplete: Number(daysToComplete),
          deadline: deadline.toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to add goal");
      const data = await res.json();
      setGoals((prev) => [data, ...prev]);
      setNewGoal("");
      setDaysToComplete("");
    } catch (err) {
      console.error("❌ Error adding goal:", err.message);
      alert("Failed to add goal.");
    }
  };

  /* =====================================
     ✅ Add subgoal
  ====================================== */
  const addSubgoal = async (goalId) => {
    if (!newSubgoal.trim()) return alert("Please enter a subgoal!");

    try {
      const res = await apiFetch(`/goals/${goalId}/subgoal`, {
        method: "POST",
        body: JSON.stringify({ title: newSubgoal }),
      });
      if (!res.ok) throw new Error("Failed to add subgoal");

      const updatedGoal = await res.json();
      setGoals((prev) =>
        prev.map((g) => (g._id === goalId ? updatedGoal : g))
      );
      setNewSubgoal("");
    } catch (err) {
      console.error("❌ Error adding subgoal:", err.message);
      alert("Failed to add subgoal.");
    }
  };

  /* =====================================
     ✅ Toggle goal completion
  ====================================== */
  const toggleComplete = async (goalId) => {
    try {
      const res = await apiFetch(`/goals/${goalId}/complete`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to update goal status");

      const updatedGoal = await res.json();
      setGoals((prev) =>
        prev.map((g) => (g._id === goalId ? updatedGoal : g))
      );
    } catch (err) {
      console.error("❌ Error toggling goal:", err.message);
      alert("Failed to update goal status.");
    }
  };

  /* =====================================
     ✅ Delete goal
  ====================================== */
  const deleteGoal = async (goalId) => {
    const confirmed = window.confirm("Are you sure you want to delete this goal?");
    if (!confirmed) return;

    try {
      const res = await apiFetch(`/goals/${goalId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete goal");
      setGoals((prev) => prev.filter((g) => g._id !== goalId));
    } catch (err) {
      console.error("❌ Error deleting goal:", err.message);
      alert("Failed to delete goal.");
    }
  };

  /* =====================================
     ✅ Edit goal
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
      const res = await apiFetch(`/goals/${goalId}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editedGoalTitle,
          daysToComplete: Number(editedDays),
          deadline: newDeadline.toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Failed to edit goal");

      const updatedGoal = await res.json();
      setGoals((prev) =>
        prev.map((g) => (g._id === goalId ? updatedGoal : g))
      );
      cancelEdit();
    } catch (err) {
      console.error("❌ Error editing goal:", err.message);
      alert("Failed to edit goal.");
    }
  };

  /* =====================================
     ✅ UI Rendering
  ====================================== */
  const getDaysLeft = (deadline) => {
    const today = new Date();
    const dueDate = new Date(deadline);
    const diff = dueDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const selectGoal = (goalId) => {
    setSelectedGoal(goalId === selectedGoal ? null : goalId);
    setNewSubgoal("");
  };

  return (
    <div className="goals-page">
      <Navbar />

      <div className="goals-container">
        <h1 className="goals-title">🎯 Your Goals</h1>

        {/* ➕ Add Goal */}
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

        {/* 🧾 Goals List */}
        <div className="goals-list">
          {goals.length === 0 ? (
            <p className="no-goals">No goals yet — start one today!</p>
          ) : (
            goals.map((goal) => {
              const daysLeft = getDaysLeft(goal.deadline);
              const isEditing = editingGoalId === goal._id;
              const isReminder = daysLeft <= 2 && daysLeft > 0;
              const isOverdue = daysLeft < 0;

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
                            onChange={(e) =>
                              setEditedGoalTitle(e.target.value)
                            }
                            className="goal-input"
                          />
                          <input
                            type="number"
                            value={editedDays}
                            onChange={(e) =>
                              setEditedDays(e.target.value)
                            }
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

                      {/* ✅ Completion Toggle */}
                      <button
                        className="tick-btn"
                        onClick={() => toggleComplete(goal._id)}
                      >
                        {goal.completed ? "✅" : "☐"}
                      </button>

                      {/* ✏️ Edit Mode */}
                      {isEditing ? (
                        <>
                          <button
                            className="goal-btn"
                            onClick={() => saveEditedGoal(goal._id)}
                          >
                            💾 Save
                          </button>
                          <button className="delete-btn" onClick={cancelEdit}>
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

                      {/* ❌ Delete */}
                      <button
                        className="delete-btn"
                        onClick={() => deleteGoal(goal._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* 📋 Subgoals */}
                  {selectedGoal === goal._id && (
                    <div className="subgoal-section">
                      <ul>
                        {goal.subgoals.map((sub, i) => (
                          <li key={i}>{sub.title}</li>
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
