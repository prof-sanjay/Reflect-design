import React, { useState, useEffect } from "react";
import "./ReflectionEditor.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ReflectionEditor = ({ selectedDate, onReflectionSaved }) => {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("Neutral");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const moods = [
    { name: "Happy", icon: "😊" },
    { name: "Neutral", icon: "😐" },
    { name: "Sad", icon: "😢" },
    { name: "Angry", icon: "😠" },
    { name: "Anxious", icon: "😰" },
    { name: "Calm", icon: "😌" },
    { name: "Excited", icon: "🤩" },
  ];

  // Fetch reflection for selected date
  useEffect(() => {
    if (!selectedDate) {
      setText("");
      setMood("Neutral");
      return;
    }

    const fetchReflection = async () => {
      setFetching(true);
      console.log("🔍 Fetching reflection for date:", selectedDate);
      
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("❌ No token found");
          return;
        }

        // Fetch all reflections and filter by date
        const res = await fetch(`${BASE_URL}/reflections`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("📡 Response status:", res.status);

        if (!res.ok) {
          console.error("❌ Error response:", res.status);
          setText("");
          setMood("Neutral");
          return;
        }

        const allReflections = await res.json();
        console.log("📦 All reflections received:", allReflections);

        // Find the reflection for the selected date
        const reflection = allReflections.find((r) => {
          const reflectionDate = new Date(r.date).toISOString().split('T')[0];
          console.log("Comparing:", reflectionDate, "with", selectedDate);
          return reflectionDate === selectedDate;
        });

        if (reflection) {
          console.log("✅ Found reflection:", reflection);
          setText(reflection.content || "");
          setMood(reflection.mood || "Neutral");
        } else {
          console.log("⚠️ No reflection found for this date");
          setText("");
          setMood("Neutral");
        }
        
      } catch (err) {
        console.error("❌ Error loading reflection:", err);
        setText("");
        setMood("Neutral");
      } finally {
        setFetching(false);
      }
    };

    fetchReflection();
  }, [selectedDate]);

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
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${BASE_URL}/reflections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: selectedDate,
          content: text,
          mood: mood,
        }),
      });

      const data = await response.json();
      console.log("💾 Save response:", data);

      if (response.ok) {
        alert(`✅ Reflection saved for ${selectedDate} (Mood: ${mood})`);

        // Notify parent component to refresh calendar with new mood
        if (onReflectionSaved) {
          onReflectionSaved({ date: selectedDate, mood: mood });
        }
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
        <>
          {fetching ? (
            <div className="loading-state">
              <p>Loading reflection...</p>
            </div>
          ) : (
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
        </>
      )}
    </div>
  );
};

export default ReflectionEditor;