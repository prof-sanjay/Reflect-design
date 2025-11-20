import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import "./Goals.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -----------------------------------------
     Fetch Goals on Mount
  ------------------------------------------*/
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/goals`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch goals");

        const data = await res.json();
        setGoals(data);
      } catch (err) {
        console.log("❌ Error loading goals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  return (
    <div className="goals-page">
      <Navbar />
      <div className="goals-container fade-in">

        {/* HEADER */}
        <header className="goals-header">
          <h1 className="goals-title">🎯 Your Goals</h1>

          <a href="/add-goal">
            <button className="add-goal-btn">+ Add Goal</button>
          </a>
        </header>

        {/* ===================== Latest 3 Goals ===================== */}
        <section className="section-block">
          <h2 className="section-title">✨ Latest Goals</h2>

          {loading ? (
            <SkeletonLoader count={3} />
          ) : goals.length === 0 ? (
            <p className="empty-text">No goals yet.</p>
          ) : (
            <div className="goals-list">
              {goals.slice(0, 3).map((goal) => (
                <GoalCard key={goal._id} goal={goal} />
              ))}
            </div>
          )}
        </section>

        <hr className="divider" />

        {/* ===================== All Goals ===================== */}
        <section className="section-block">
          <h2 className="section-title">📌 All Goals</h2>

          {loading ? (
            <SkeletonLoader count={4} />
          ) : (
            <div className="goals-list">
              {goals.map((goal) => (
                <GoalCard key={goal._id} goal={goal} expanded />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* ================================================================
   Helpers - Priority + Status Colors
================================================================= */
const getPriorityColor = (priority) => {
  if (!priority) return "#6b7280";
  switch (priority.toLowerCase()) {
    case "high": return "#ef4444";
    case "medium": return "#f59e0b";
    case "low": return "#10b981";
    default: return "#6b7280";
  }
};

const getStatusColor = (status) => {
  if (!status) return "#9ca3af";
  switch (status.toLowerCase()) {
    case "pending": return "#a3a3a3";
    case "inprogress": return "#3b82f6";
    case "completed": return "#22c55e";
    default: return "#9ca3af";
  }
};

/* ================================================================
   Skeleton Loader (while fetching)
================================================================= */
function SkeletonLoader({ count = 3 }) {
  return (
    <div className="skeleton-list">
      {[...Array(count)].map((_, i) => (
        <div className="skeleton-card" key={i}></div>
      ))}
    </div>
  );
}

/* ================================================================
   Goal Card Component
================================================================= */
function GoalCard({ goal, expanded = false }) {
  return (
    <div className={`goal-card ${goal.status === "completed" ? "completed" : ""}`}>

      {/* Header Row */}
      <div className="goal-header-row">
        <h3 className="goal-title">{goal.title}</h3>

        <div className="badges">
          {/* Priority badge */}
          <span
            className="badge"
            style={{ backgroundColor: getPriorityColor(goal.priority) }}
          >
            {goal.priority}
          </span>

          {/* Status badge */}
          <span
            className="badge"
            style={{ backgroundColor: getStatusColor(goal.status) }}
          >
            {goal.status}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="goal-desc">{goal.description}</p>

      {/* Deadline */}
      {goal.deadline && (
        <p className="goal-deadline">
          📅 Deadline: <strong>{new Date(goal.deadline).toLocaleDateString()}</strong>
        </p>
      )}

      {/* Expanded Mode */}
      {expanded && (
        <div className="meta-row">
          <span>Created: {new Date(goal.createdAt).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
}
