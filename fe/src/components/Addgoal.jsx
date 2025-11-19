import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import "./Goals.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function AddGoal() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    deadline: "",
    status: "Not Started",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add goal");

      alert("Goal added successfully!");

      setFormData({
        title: "",
        description: "",
        category: "",
        priority: "Medium",
        deadline: "",
        status: "Not Started",
      });

      window.location.href = "/goals";
    } catch (err) {
      console.error(err);
      alert("Error adding goal");
    }
  };

  return (
    <div className="goals-container">
      <Navbar />
      <h1 className="title">Add New Goal</h1>

      <form className="goal-form" onSubmit={handleSubmit}>

        {/* Title */}
        <label className="goal-label">Goal Title</label>
        <input
          type="text"
          name="title"
          placeholder="Enter your goal title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* Description */}
        <label className="goal-label">Description</label>
        <textarea
          name="description"
          placeholder="Write a short description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        {/* Category */}
        <label className="goal-label">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option>Health</option>
          <option>Study</option>
          <option>Career</option>
          <option>Personal</option>
          <option>Finance</option>
        </select>

        {/* Priority */}
        <label className="goal-label">Priority</label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        {/* Deadline */}
        <label className="goal-label">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
        />

        {/* Status */}
        <label className="goal-label">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <button type="submit">Add Goal</button>
      </form>
    </div>
  );
}

export default AddGoal;
