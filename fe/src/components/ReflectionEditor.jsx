import React, { useState } from "react";
import "./ReflectionEditor.css";

const ReflectionEditor = ({ selectedDate }) => {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("Neutral");

  const moods = [
    { name: "Happy", icon: "😊" },
    { name: "Neutral", icon: "😐" },
    { name: "Sad", icon: "😢" },
    { name: "Angry", icon: "😠" },
    { name: "Anxious", icon: "😰" },
  ];

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedDate) {
      alert("Please select a date first!");
      return;
    }
    if (!text.trim()) {
      alert("Please write something before saving.");
      return;
    }

    alert(`Saved reflection for ${selectedDate} (Mood: ${mood})`);
    setText("");
  };

  return (
    <div className="reflection-editor">
      <h2>
        {selectedDate
          ? `Reflection for ${selectedDate}`
          : "Select a date to write your reflection"}
      </h2>

      {selectedDate && (
        <form onSubmit={handleSave} className="reflection-form">
          <textarea
            className="reflection-textarea"
            placeholder="How was your day? Write your thoughts here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
          ></textarea>

          <div className="char-count">{text.length}/500</div>

          <div className="mood-picker">
            <p className="mood-label">Select your mood:</p>
            <div className="mood-options">
              {moods.map((m) => (
                <button
                  type="button"
                  key={m.name}
                  className={`mood-btn ${mood === m.name ? "selected" : ""}`}
                  onClick={() => setMood(m.name)}
                >
                  <span className="mood-icon">{m.icon}</span>
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="save-btn">
            Save Reflection
          </button>
        </form>
      )}
    </div>
  );
};

export default ReflectionEditor;
