// fe/src/components/ImprovedGoals.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ImprovedGoals.css";

const ImprovedGoals = () => {
  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "General",
    priority: "Medium",
    deadline: "",
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5003/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(res.data);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newGoal.title || !newGoal.description || !newGoal.deadline) {
      console.error("Missing required fields: title, description, and deadline are all required");
      alert("Please fill in all required fields: title, description, and deadline");
      return;
    }
    
    // Validate date format
    const deadlineDate = new Date(newGoal.deadline);
    if (isNaN(deadlineDate.getTime())) {
      console.error("Invalid date format");
      alert("Please enter a valid date");
      return;
    }
    
    // Format the goal data with proper date handling
    const goalData = {
      ...newGoal,
      deadline: deadlineDate.toISOString(),
    };
    
    console.log("Attempting to create goal with data:", goalData);
    
    try {
      const token = localStorage.getItem("token");
      console.log("Using token:", token ? "Token present" : "No token");
      
      const response = await axios.post("http://localhost:5003/api/goals", goalData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Goal created successfully:", response.data);
      setNewGoal({ title: "", description: "", category: "General", priority: "Medium", deadline: "" });
      setShowCreateForm(false);
      fetchGoals();
    } catch (error) {
      console.error("Failed to create goal:", error);
      console.error("Error response:", error.response?.data);
      alert("Failed to create goal: " + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateStatus = async (goalId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5003/api/goals/${goalId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchGoals();
    } catch (error) {
      console.error("Failed to update goal:", error);
    }
  };

  const filteredGoals = goals.filter((goal) => {
    if (filter === "all") return true;
    return goal.status === filter;
  });

  const getPriorityColor = (priority) => {
    const colors = { High: "#ef4444", Medium: "#f59e0b", Low: "#10b981" };
    return colors[priority] || "#6b7280";
  };

  return (
    <div className="improved-goals">
      <div className="goals-header">
        <h1>🎯 Goals</h1>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-new-goal">
          + New Goal
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateGoal} className="goal-create-form">
          <input
            type="text"
            placeholder="Goal title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            required
          />
          <select value={newGoal.priority} onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <input
            type="date"
            value={newGoal.deadline}
            onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
            required
          />
          <div className="form-actions">
            <button type="submit" className="btn-submit">Create Goal</button>
            <button type="button" onClick={() => setShowCreateForm(false)} className="btn-cancel-form">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="filter-tabs">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
          All
        </button>
        <button className={filter === "Not Started" ? "active" : ""} onClick={() => setFilter("Not Started")}>
          Not Started
        </button>
        <button className={filter === "InProgress" ? "active" : ""} onClick={() => setFilter("InProgress")}>
          In Progress
        </button>
        <button className={filter === "Completed" ? "active" : ""} onClick={() => setFilter("Completed")}>
          Completed
        </button>
      </div>

      <div className="goals-list">
        {filteredGoals.map((goal) => (
          <div key={goal._id} className="goal-card-improved">
            <div className="goal-card-header">
              <h3>{goal.title}</h3>
              <span className="priority-badge" style={{ background: getPriorityColor(goal.priority) }}>
                {goal.priority}
              </span>
            </div>
            <p className="goal-description">{goal.description}</p>
            <div className="goal-meta">
              <span className="deadline">📅 {new Date(goal.deadline).toLocaleDateString()}</span>
              <span className={`status-badge ${goal.status}`}>{goal.status}</span>
            </div>
            <div className="goal-actions">
              <button onClick={() => handleUpdateStatus(goal._id, "InProgress")} className="btn-start">
                Start
              </button>
              <button onClick={() => handleUpdateStatus(goal._id, "Completed")} className="btn-complete-goal">
                Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImprovedGoals;
