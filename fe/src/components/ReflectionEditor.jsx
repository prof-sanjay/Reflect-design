import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import ReflectionEditor from "./ReflectionEditor.jsx";
import "./NewReflection.css";

const NewReflection = () => {
  const [mood, setMood] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!content || !mood) {
      alert("Please fill in your reflection and select a mood before saving.");
      return;
    }

    console.log("Reflection Saved:", { mood, content });
    alert("Reflection saved successfully!");
    setMood("");
    setContent("");
  };

  return (
    <div className="new-reflection-page">
      <Navbar />

      <div className="new-reflection-container">
        <h1 className="reflection-title">🧘‍♀️ New Reflection</h1>

        <div className="reflection-form">
          <label htmlFor="mood">Mood</label>
          <select
            id="mood"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="reflection-select"
          >
            <option value="">-- Select your mood --</option>
            <option value="happy">😊 Happy</option>
            <option value="sad">😔 Sad</option>
            <option value="neutral">😐 Neutral</option>
            <option value="anxious">😰 Anxious</option>
            <option value="angry">😠 Angry</option>
            <option value="grateful">🙏 Grateful</option>
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
