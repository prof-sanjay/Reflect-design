import React, { useState } from "react";
import Navbar from "./Navbar";
import "./AddGoal.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AddGoal() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !category || !deadline) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/goals`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          deadline,
          status,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Goal added successfully!");
        window.location.href = "/goals";
      } else {
        alert(data.message || "Failed to add goal");
      }

    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="add-goal-page">
      <Navbar />

      <div className="add-goal-container">
        <h1 className="page-title">Add New Goal</h1>

        <form className="goal-form" onSubmit={handleSubmit}>
          
          <label>Goal Title</label>
          <input
            className="input"
            placeholder="Enter your goal title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Description</label>
          <textarea
            className="textarea"
            placeholder="Write a short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Category</label>
          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Personal">Personal</option>
            <option value="Career">Career</option>
            <option value="Health">Health</option>
            <option value="Finance">Finance</option>
            <option value="Education">Education</option>
          </select>

          <label>Priority</label>
          <select
            className="input"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <label>Deadline</label>
          <input
            type="date"
            className="input"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <label>Status</label>
          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Not Started</option>
            <option>InProgress</option>
            <option>Completed</option>
          </select>

          <button className="save-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Goal"}
          </button>

        </form>
      </div>
    </div>
  );
}
