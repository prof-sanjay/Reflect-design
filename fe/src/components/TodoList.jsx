import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import "./TodoList.css";

const API_URL = "http://localhost:5000/api/tasks";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState("");

  // ✅ Always get token directly from localStorage (so it's fresh)
  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // ✅ Fetch tasks for the logged-in user
  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("❌ Error fetching tasks:", err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchTasks();
    else window.location.href = "/";
  }, []);

  // ✅ Add new task
  const handleAddTask = async () => {
    if (newTask.trim() === "") return alert("Please enter a valid task.");
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
      startDate: today.toDateString(),
      deadline: selectedDate.toDateString(),
      lastUpdated: today.toDateString(),
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(newItem),
      });

      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/";
        return;
      }

      if (!res.ok) throw new Error("Failed to add task");

      const data = await res.json();
      setTasks((prev) => [...prev, data]);
      setNewTask("");
      setDeadline("");
    } catch (err) {
      console.error("❌ Error adding task:", err.message);
    }
  };

  // ✅ Update task completion
  const toggleTask = async (id, completed) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ completed }),
      });

      if (!res.ok) throw new Error("Failed to update task");
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      console.error("❌ Error updating task:", err.message);
    }
  };

  // ✅ Edit task text
  const editTask = async (id, newText) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ text: newText }),
      });

      if (!res.ok) throw new Error("Failed to edit task");
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      console.error("❌ Error editing task:", err.message);
    }
  };

  // ✅ Delete task
  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("❌ Error deleting task:", err.message);
    }
  };

  // ✅ Toggle edit mode
  const toggleEdit = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, editing: !t.editing } : t))
    );
  };

  // ✅ Progress calculation
  const progress = tasks.length
    ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)
    : 0;

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

        {/* 📊 Progress bar */}
        {tasks.length > 0 && (
          <>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="progress-text">
              {progress}% completed ({tasks.filter((t) => t.completed).length}/
              {tasks.length})
            </p>
          </>
        )}

        {/* 🧾 Task list */}
        <div className="task-list">
          {tasks.length === 0 ? (
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
                  <p>Start: {t.startDate}</p>
                  <p>Deadline: {t.deadline}</p>
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
