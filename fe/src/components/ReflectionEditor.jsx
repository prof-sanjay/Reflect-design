import React, { useState, useEffect } from "react";
import "./ReflectionEditor.css";

const ReflectionEditor = ({ selectedDate, onReflectionSaved }) => {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("Neutral");
  const [loading, setLoading] = useState(false);

  const moods = [
    { name: "Happy", icon: "😊" },
    { name: "Neutral", icon: "😐" },
    { name: "Sad", icon: "😢" },
    { name: "Angry", icon: "😠" },
    { name: "Anxious", icon: "😰" },
    { name: "Calm", icon: "😌" },
    { name: "Excited", icon: "🤩" },
  ];

  // ---------------------------------------------------
  // ⭐ NEW: Fetch reflection for selected date
  // ---------------------------------------------------
  useEffect(() => {
    if (!selectedDate) return;

    const fetchReflection = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/reflections/${selectedDate}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) {
          setText("");
          setMood("Neutral");
          return;
        }

        const data = await res.json();

        setText(data.content || "");
        setMood(data.mood || "Neutral");
      } catch (err) {
        console.error("Error loading reflection:", err);
      }
    };

    fetchReflection();
  }, [selectedDate]);
  // ---------------------------------------------------

  const handleSave = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      alert("Please select a date first!");
      return;
    }

    if (!text.trim()) {
      alert("Please write something before saving.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/reflections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          date: selectedDate,
          content: text,
          mood: mood,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Reflection saved for ${selectedDate} (Mood: ${mood})`);

        // ⭐ NEW: Notify parent to refresh
        if (onReflectionSaved) onReflectionSaved();

        // ⭐ Do NOT clear text — we want to show saved reflection
      } else {
        alert("❌ Failed: " + data.message);
      }
    } catch (error) {
      console.error("Error saving reflection:", error);
      alert("⚠️ Could not connect to the server.");
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
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
                  disabled={loading}
                >
                  <span className="mood-icon">{m.icon}</span>
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? "Saving..." : "Save Reflection"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReflectionEditor;
