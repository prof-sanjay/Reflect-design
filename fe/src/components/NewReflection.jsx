import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import ReflectionEditor from "./ReflectionEditor.jsx";
import "./NewReflection.css";

const NewReflection = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");

  const handleSave = () => {
    if (!title || !content) {
      alert("Please complete all fields before saving.");
      return;
    }
    console.log("Reflection saved:", { title, content, mood });
    alert("Your reflection has been saved successfully!");
    setTitle("");
    setContent("");
    setMood("neutral");
  };

  return (
    <div className="new-reflection-page">
      <Navbar />

      <div className="new-reflection-container">
        <h1 className="reflection-title">📝 Start a New Reflection</h1>

        <div className="reflection-form">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your reflection..."
            className="reflection-input"
          />

          <label>Mood</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="reflection-select"
          >
            <option value="happy">😊 Happy</option>
            <option value="sad">😔 Sad</option>
            <option value="neutral">😐 Neutral</option>
            <option value="excited">🤩 Excited</option>
            <option value="angry">😠 Angry</option>
          </select>

          <label>Your Reflection</label>
          <ReflectionEditor content={content} setContent={setContent} />

          <button className="save-btn" onClick={handleSave}>
            💾 Save Reflection
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewReflection;
