import React, { useState, useEffect } from "react";
import "./TodoList.css";
import Navbar from "./Navbar.jsx"

const TodoList = () => {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [showInput, setShowInput] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim() === "") return;
    setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
    setInput("");
    setShowInput(false);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2 className="todo-title">Checklist</h2>
        <button className="add-btn" onClick={() => setShowInput(!showInput)}>
          + Add Task
        </button>
      </div>

      {showInput && (
        <div className="todo-input-section">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter new task..."
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            className="todo-input"
          />
          <button onClick={addTodo} className="todo-save-btn">
            Add
          </button>
        </div>
      )}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <div className="todo-left">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="todo-checkbox"
              />
              <span
                className={`todo-text ${todo.completed ? "completed" : ""}`}
              >
                {todo.text}
              </span>
            </div>
            <button
              className="delete-btn"
              onClick={() => deleteTodo(todo.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="todo-empty">No tasks yet. Add one above 👆</p>
      )}
    </div>
  );
};

export default TodoList;
