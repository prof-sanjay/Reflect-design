// fe/src/pages/EveningReflection.jsx
import React, { useState } from "react";
import { updateReflection, summarizeReflection } from "../utils/api";
import "../styles/ReflectionMode.css";

const EveningReflection = () => {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("neutral");
  const [summary, setSummary] = useState(null);

  const eveningPrompts = [
    "What went well today?",
    "What challenges did you overcome?",
    "What are you proud of?",
    "What could you improve tomorrow?",
    "What are you grateful for from today?",
  ];

  const handleSummarize = async () => {
    if (content.length > 30) {
      try {
        const result = await summarizeReflection(content);
        setSummary(result);
      } catch (error) {
        console.error("Summarization failed:", error);
      }
    }
  };

  const handleSave = async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      await updateReflection({ date: today, content, mood });
      alert("Evening reflection saved!");
      setContent("");
      setSummary(null);
    } catch (error) {
      console.error("Failed to save reflection:", error);
    }
  };

  return (
    <div className="reflection-mode evening">
      <div className="mode-header">
        <h1>🌙 Evening Reflection</h1>
        <p className="mode-desc">Review your day and unwind</p>
      </div>

      <div className="prompts-box">
        <h3>Evening Prompts</h3>
        <ul>
          {eveningPrompts.map((prompt, index) => (
            <li key={index}>{prompt}</li>
          ))}
        </ul>
      </div>

      <div className="reflection-editor-box">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your evening reflection..."
          rows="10"
        />

        <button onClick={handleSummarize} className="btn-summarize">
          📝 Summarize with AI
        </button>

        {summary && (
          <div className="ai-summary">
            <h4>Summary</h4>
            <p>{summary.summary}</p>
            {summary.keyTopics && summary.keyTopics.length > 0 && (
              <div className="key-topics">
                <strong>Key Topics:</strong> {summary.keyTopics.join(", ")}
              </div>
            )}
          </div>
        )}

        <div className="mood-selector">
          <label>Your mood:</label>
          <select value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="happy">😊 Happy</option>
            <option value="calm">😌 Calm</option>
            <option value="neutral">😐 Neutral</option>
            <option value="tired">😴 Tired</option>
            <option value="anxious">😰 Anxious</option>
            <option value="sad">😢 Sad</option>
          </select>
        </div>

        <button onClick={handleSave} className="btn-save-reflection">
          Save Evening Reflection
        </button>
      </div>
    </div>
  );
};

export default EveningReflection;
