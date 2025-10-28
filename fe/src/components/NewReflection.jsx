import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import "./NewReflection.css";

const NewReflection = () => {
  const [reflection, setReflection] = useState("");
  const [mood, setMood] = useState("");

  const handleSave = () => {
    if (!reflection || !mood) {
      alert("Please fill in your reflection and select a mood before saving.");
      return;
    }

    console.log("Saved Reflection:", { reflection, mood });
    alert("Reflection saved successfully!");
    setReflection("");
    setMood("");
  };

  return (
    <div className="new-reflection-page">
      <Navbar />

      <div className="new-reflection-container">
        <h1 className="reflection-title">🧠 New Reflection</h1>

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

          <label htmlFor="reflection">Reflection</label>
          <textarea
            id="reflection"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Write your thoughts here..."
            className="reflection-textarea"
            rows="8"
          ></textarea>

          <button className="save-btn" onClick={handleSave}>
            💾 Save Reflection
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewReflection;
