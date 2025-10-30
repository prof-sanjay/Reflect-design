import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import "./ToDoList.css";

const motivationalQuotes = [
  "Keep it up — progress, not perfection!",
  "You're doing amazing — one day at a time!",
  "Stay focused — small steps lead to big wins!",
  "Consistency beats motivation. Keep going!",
  "You're halfway there — don’t stop now!",
  "Believe in your effort, you’re growing stronger!"
];

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [deadline, setDeadline] = useState("");

  // Load saved tasks
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("todoTasks")) || [];
    setTasks(saved);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task with a deadline
  const handleAddTask = () => {
    if (newTask.trim() === "") return alert("Please enter a valid task.");
    if (!deadline) return alert("Please select a deadline date.");

    const today = new Date();
    const selectedDate = new Date(deadline);

    // Validation: deadline must be after today
    if (selectedDate <= today) {
      return alert("Deadline must be after today's date!");
    }

    // Calculate total days between start and deadline
    const timeDiff = selectedDate - today;
    const totalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const newItem = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      editing: false,
      totalDays: totalDays,
      currentDay: 1,
      startDate: today.toDateString(),
      deadline: selectedDate.toDateString(),
      lastUpdated: today.toDateString(),
    };

    setTasks([...tasks, newItem]);
    setNewTask("");
    setDeadline("");
  };

  // Toggle complete
  const toggleTask = (id) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Toggle edit mode
  const toggleEdit = (id) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, editing: !t.editing } : t)));
  };

  // Edit task text
  const editTask = (id, newText) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, text: newText, editing: false } : t)));
  };

  // Calculate overall progress
  const progress = tasks.length
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
    : 0;

  // Auto-increment day every new day at 12AM
  useEffect(() => {
    const checkMidnight = () => {
      const today = new Date().toDateString();
      setTasks(prev =>
        prev.map(t => {
          if (t.lastUpdated !== today && t.currentDay < t.totalDays) {
            return { ...t, currentDay: t.currentDay + 1, lastUpdated: today };
          }
          return t;
        })
      );
    };

    const now = new Date();
    const millisTillMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1) - now;
    const timeout = setTimeout(() => {
      checkMidnight();
      setInterval(checkMidnight, 24 * 60 * 60 * 1000); // every 24h
    }, millisTillMidnight);

    return () => clearTimeout(timeout);
  }, []);

  // Manually go to next day
  const nextDayManual = (id) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id && t.currentDay < t.totalDays
          ? { ...t, currentDay: t.currentDay + 1 }
          : t
      )
    );
  };

  // Motivation message (includes deadline check)
  const getMotivation = (day, total, deadline, completed) => {
    const today = new Date();
    const end = new Date(deadline);

    if (today > end && !completed) {
      return "❌ Task not completed (deadline missed!)";
    }

    const ratio = day / total;
    if (ratio < 0.3) return "🌱 Just starting — great momentum!";
    if (ratio < 0.6) return "🔥 You’re halfway there!";
    if (ratio < 1) return "🚀 Almost done — finish strong!";
    if (completed) return "🎉 Completed! Great job!";
  };

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

        {/* Progress */}
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

        {/* Task list */}
        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet — start one today!</p>
          ) : (
            tasks.map((t) => (
              <div key={t.id} className={`task-card ${t.completed ? "completed" : ""}`}>
                
                {/* Header with checkbox and text */}
                <div className="task-header">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleTask(t.id)}
                    className="task-checkbox"
                  />

                  {t.editing ? (
                    <input
                      type="text"
                      className="edit-input"
                      defaultValue={t.text}
                      onBlur={(e) => editTask(t.id, e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <span className="task-text">{t.text}</span>
                  )}
                </div>

                {/* Task timeline */}
                <div className="timeline">
                  <p>Start: {t.startDate}</p>
                  <p>Deadline: {t.deadline}</p>
                  <p>Day {t.currentDay} / {t.totalDays}</p>
                  <p>⏳ {t.totalDays - t.currentDay} days left</p>
                  {/* <p className="motivation">{getMotivation(t.currentDay, t.totalDays, t.deadline, t.completed)}</p> */}
                </div>

                {/* Action buttons */}
                <div className="task-actions">
                  {/* <button onClick={() => nextDayManual(t.id)}>📅 Next Day</button> */}
                  <button onClick={() => toggleEdit(t.id)}>✏</button>
                  <button onClick={() => deleteTask(t.id)}>🗑</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ToDoList;
