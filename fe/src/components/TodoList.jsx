import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import "./TodoList.css";

// ✅ Base API URL (Vite env or default local backend)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * 🔐 Helper — logout + redirect when session expires
 */
const handleLogout = () => {
  localStorage.clear();
  alert("Session expired. Please log in again.");
  window.location.href = "/";
};

/**
 * 🌐 Helper — centralized fetch with JWT Authorization header
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
 * 📋 TodoList Component — Tracks user’s personal tasks
 */
const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all tasks on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await apiFetch("/tasks", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("❌ Error fetching tasks:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  /**
   * ➕ Add new task
   */
  const handleAddTask = async () => {
    if (!newTask.trim()) return alert("Please enter a valid task.");
    if (!deadline) return alert("Please select a deadline date.");

    const today = new Date();
    const selectedDate = new Date(deadline);
    if (selectedDate <= today)
      return alert("Deadline must be after today's date!");

    const totalDays = Math.ceil(
      (selectedDate - today) / (1000 * 60 * 60 * 24)
    );

    const newItem = {
      text: newTask.trim(),
      completed: false,
      totalDays,
      currentDay: 1,
      startDate: today.toISOString(),
      deadline: selectedDate.toISOString(),
      lastUpdated: today.toISOString(),
    };

    try {
      const res = await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error("Failed to add task");

      const data = await res.json();
      setTasks((prev) => [...prev, data]);
      setNewTask("");
      setDeadline("");
    } catch (err) {
      console.error("❌ Error adding task:", err.message);
    }
  };

  /**
   * 🔁 Update completion status
   */
  const toggleTask = async (id, completed) => {
    try {
      const res = await apiFetch(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ completed }),
      });
      if (!res.ok) throw new Error("Failed to update task");

      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      console.error("❌ Error updating task:", err.message);
    }
  };

  /**
   * ✏️ Edit task text
   */
  const editTask = async (id, newText) => {
    try {
      const res = await apiFetch(`/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ text: newText }),
      });
      if (!res.ok) throw new Error("Failed to edit task");

      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      console.error("❌ Error editing task:", err.message);
    }
  };

  /**
   * ❌ Delete task
   */
  const deleteTask = async (id) => {
    try {
      const res = await apiFetch(`/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("❌ Error deleting task:", err.message);
    }
  };

  /**
   * 🖊️ Toggle edit mode
   */
  const toggleEdit = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, editing: !t.editing } : t))
    );
  };

  /**
   * 📊 Calculate overall progress
   */
  const progress = tasks.length
    ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)
    : 0;

  // 🧱 Render Component
  return (
    <div className="todolist-page">
      <Navbar />
      <div className="todolist-container">
        <h1 className="todolist-title">📅 To-Do Timeline Tracker</h1>
        <p className="todolist-subtitle">
          Track your tasks with daily progress & motivation.
        </p>

        {/* ➕ Add new task */}
        <div className="add-task">
          <input
            type="text"
            placeholder="Enter a task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="task-input"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="date-input"
            min={new Date().toISOString().split("T")[0]}
          />
          <button onClick={handleAddTask} className="add-btn">
            ➕ Add
          </button>
        </div>

        {/* 📊 Progress */}
        {tasks.length > 0 && (
          <>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="progress-text">
              {progress}% completed (
              {tasks.filter((t) => t.completed).length}/{tasks.length})
            </p>
          </>
        )}

        {/* 🧾 Task List */}
        <div className="task-list">
          {loading ? (
            <p className="loading">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet — start one today!</p>
          ) : (
            tasks.map((t) => (
              <div
                key={t._id}
                className={`task-card ${t.completed ? "completed" : ""}`}
              >
                <div className="task-header">
                  {t.editing ? (
                    <input
                      type="text"
                      className="edit-input"
                      defaultValue={t.text}
                      onBlur={(e) => editTask(t._id, e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <span className="task-text">{t.text}</span>
                  )}
                </div>

                <div className="timeline">
                  <p>Start: {new Date(t.startDate).toLocaleDateString()}</p>
                  <p>Deadline: {new Date(t.deadline).toLocaleDateString()}</p>
                  <p>
                    Day {t.currentDay} / {t.totalDays}
                  </p>
                  <p>⏳ {t.totalDays - t.currentDay} days left</p>
                </div>

                <div className="task-actions">
                  <button onClick={() => toggleEdit(t._id)}>Edit</button>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleTask(t._id, !t.completed)}
                    className="task-checkbox"
                  />
                  <button onClick={() => deleteTask(t._id)}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoList;
