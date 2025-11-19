import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import "./Goals.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Goals() {
  const [goals, setGoals] = useState([]);

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
        console.log(err);
      }
    };

    fetchGoals();
  }, []);

  return (
    <div className="goals-page">
      <Navbar />

      <div className="goals-container">
        <h1 className="goals-title">Your Goals</h1>

        {/* Add Goal Button */}
        <div className="goals-header-section">
          <a href="/add-goal">
            <button className="add-goal-btn">+ Add Goal</button>
          </a>
        </div>

        {/* Latest 3 Goals Section */}
        <h2 className="sub-title">Latest Goals</h2>

        <div className="goals-list">
          {goals.length === 0 ? (
            <p className="no-goals">No goals found</p>
          ) : (
            goals.slice(0, 3).map((goal) => (
              <div key={goal._id} className="goal-card">
                <div className="goal-header">
                  <span className="goal-title">{goal.title}</span>
                </div>
                <p className="goal-desc">{goal.description}</p>
              </div>
            ))
          )}
        </div>

        <hr className="divider" />

        {/* All Goals Section */}
        <h2 className="sub-title">All Goals</h2>

        <div className="goals-list">
          {goals.map((goal) => (
            <div key={goal._id} className="goal-card">
              <div className="goal-header">
                <span className="goal-title">{goal.title}</span>
              </div>
              <p className="goal-desc">{goal.description}</p>

              {/* Optional: deadline, priority, etc */}
              {goal.deadline && (
                <p className="goal-deadline">
                  Deadline: {new Date(goal.deadline).toLocaleDateString()}
                </p>
              )}

              <p className="goal-meta">
                Priority: <strong>{goal.priority}</strong> | Status:{" "}
                <strong>{goal.status}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Goals;
