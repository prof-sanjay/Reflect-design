import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import "./TodoList.css";

const API_URL = "http://localhost:5000/api/tasks"; // ✅ Backend route

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState("");

  // ✅ Load tasks from MongoDB via backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("❌ Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  // ✅ Add new task
  const handleAddTask = async () => {
    if (newTask.trim() === "") return alert("Please enter a valid task.");
    if (!deadline) return alert("Please select a deadline date.");

    const today = new Date();
    const selectedDate = new Date(deadline);

    if (selectedDate <= today) {
      return alert("Deadline must be after today's date!");
    }

    const totalDays = Math.ceil((selectedDate - today) / (1000 * 60 * 60 * 24));

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      const data = await res.json();
      setTasks([...tasks, data]);
      setNewTask("");
      setDeadline("");
    } catch (err) {
      console.error("❌ Error adding task:", err);
    }
  };

  // ✅ Toggle task completion
  const toggleTask = async (id, completed) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
      const updated = await res.json();
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      console.error("❌ Error updating task:", err);
    }
  };

  // ✅ Delete task
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error("❌ Error deleting task:", err);
    }
  };

  // ✅ Edit task text
  const editTask = async (id, newText) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText }),
      });
      const updated = await res.json();
      setTasks(tasks.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      console.error("❌ Error editing task:", err);
    }
  };

  // ✅ Toggle edit mode (frontend only)
  const toggleEdit = (id) => {
    setTasks(tasks.map((t) => (t._id === id ? { ...t, editing: !t.editing } : t)));
  };

  // ✅ Calculate progress
  const progress = tasks.length
    ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)
    : 0;

  return (
    <div className="todolist-page">
      <Navbar />
      <div className="todolist-container">
        <h1 className="todolist-title">📅 To-Do Timeline Tracker</h1>
        <p className="todolist-subtitle">Track your tasks with daily progress & motivation.</p>

        {/* Add new task */}
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
          <button onClick={handleAddTask} className="add-btn">➕ Add</button>
        </div>

        {/* Progress Bar */}
        {tasks.length > 0 && (
          <>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">
              {progress}% completed ({tasks.filter(t => t.completed).length}/{tasks.length})
            </p>
          </>
        )}

        {/* Task List */}
        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet — start one today!</p>
          ) : (
            tasks.map((t) => (
              <div key={t._id} className={`task-card ${t.completed ? "completed" : ""}`}>
                <div className="task-header">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleTask(t._id, !t.completed)}
                    className="task-checkbox"
                  />

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
                  <p>Day {t.currentDay} / {t.totalDays}</p>
                  <p>⏳ {t.totalDays - t.currentDay} days left</p>
                </div>

                <div className="task-actions">
                  <button onClick={() => toggleEdit(t._id)}>✏</button>
                  <button onClick={() => deleteTask(t._id)}>🗑</button>
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
