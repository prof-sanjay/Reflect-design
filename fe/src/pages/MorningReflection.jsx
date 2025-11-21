// fe/src/pages/MorningReflection.jsx
import React, { useState } from "react";
import { updateReflection, predictMood } from "../utils/api";
import "../styles/ReflectionMode.css";

const MorningReflection = () => {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [predictedMood, setPredictedMood] = useState(null);

  const morningPrompts = [
    "What are you grateful for this morning?",
    "What are your intentions for today?",
    "How did you sleep last night?",
    "What energy level do you have today?",
    "What challenges might you face today?",
  ];

  const handlePredictMood = async () => {
    if (content.length > 20) {
      try {
        const result = await predictMood(content);
        setPredictedMood(result.predictedMood);
        setMood(result.predictedMood);
      } catch (error) {
        console.error("Mood prediction failed:", error);
      }
    }
  };

  const handleSave = async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      await updateReflection({ date: today, content, mood });
      alert("Morning reflection saved!");
      setContent("");
      setPredictedMood(null);
    } catch (error) {
      console.error("Failed to save reflection:", error);
    }
  };

  return (
    <div className="reflection-mode morning">
      <div className="mode-header">
        <h1>🌅 Morning Reflection</h1>
        <p className="mode-desc">Start your day with intention and gratitude</p>
      </div>

      <div className="prompts-box">
        <h3>Morning Prompts</h3>
        <ul>
          {morningPrompts.map((prompt, index) => (
            <li key={index}>{prompt}</li>
          ))}
        </ul>
      </div>

      <div className="reflection-editor-box">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handlePredictMood}
          placeholder="Write your morning reflection..."
          rows="10"
        />

        {predictedMood && (
          <div className="ai-prediction">
            <span>AI detected mood: <strong>{predictedMood}</strong></span>
          </div>
        )}

        <div className="mood-selector">
          <label>Your mood:</label>
          <select value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="happy">😊 Happy</option>
            <option value="calm">😌 Calm</option>
            <option value="excited">🤩 Excited</option>
            <option value="neutral">😐 Neutral</option>
            <option value="anxious">😰 Anxious</option>
            <option value="sad">😢 Sad</option>
          </select>
        </div>

        <button onClick={handleSave} className="btn-save-reflection">
          Save Morning Reflection
        </button>
      </div>
    </div>
  );
};

export default MorningReflection;
