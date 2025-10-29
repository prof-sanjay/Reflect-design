import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import "./ToDoList.css";

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim() === "") return alert("Please enter a task.");
    setTasks([...tasks, { text: newTask, completed: false }]);
    setNewTask("");
  };

  const toggleTask = (index) => {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="todolist-page">
      <Navbar />
      <div className="todolist-container">
        <h1 className="todolist-title">📋 My To-Do List</h1>

        {/* Add new task */}
        <div className="add-task">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="task-input"
          />
          <button onClick={handleAddTask} className="add-btn">
            ➕ Add
          </button>
        </div>

        {/* Task list */}
        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="no-tasks">No tasks yet. Add your first one!</p>
          ) : (
            tasks.map((task, index) => (
              <div
                key={index}
                className={`task-card ${task.completed ? "completed" : ""}`}
              >
                <div
                  className="task-text"
                  onClick={() => toggleTask(index)}
                >
                  {task.text}
                </div>
                <div className="task-actions">
                  <button onClick={() => toggleTask(index)}>
                    {task.completed ? "✅" : "☐"}
                  </button>
                  <button onClick={() => deleteTask(index)}>🗑️</button>
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
