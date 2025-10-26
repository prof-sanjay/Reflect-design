import React, { useState } from "react";
import "./JournalForm.css";
import Calendar from "./Calendar"; // ✅ Import your Calendar component

const JournalForm = ({ onSubmit, user, moodData, onDateSelect, selectedDate }) => {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("Neutral");
  const [charCount, setCharCount] = useState(0);
  const [activePage, setActivePage] = useState("home"); // "home" | "reflections"

  const moods = [
    { name: "Happy", icon: "😊" },
    { name: "Neutral", icon: "😐" },
    { name: "Sad", icon: "😢" },
    { name: "Angry", icon: "😠" },
    { name: "Anxious", icon: "😰" },
  ];

  const handleChange = (e) => {
    setText(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleMoodChange = (m) => setMood(m);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSubmit({
      text,
      mood,
      date: new Date(),
    });

    setText("");
    setMood("Neutral");
    setCharCount(0);
  };

  return (
    <div className="journal-container">
      {/* ✅ Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <h1 className="nav-logo">Reflect</h1>
        </div>

        <div className="nav-right">
          <button
            className={`nav-btn ${activePage === "home" ? "active" : ""}`}
            onClick={() => setActivePage("home")}
          >
            Home
          </button>
          <button
            className={`nav-btn ${activePage === "reflections" ? "active" : ""}`}
            onClick={() => setActivePage("reflections")}
          >
            Past Reflections
          </button>
          <span className="username">{user?.username || "Guest"}</span>
        </div>
      </nav>

      {/* ✅ Home Page (Splash + Form) */}
      {activePage === "home" && (
        <main className="home-section">
          <header className="splash-header">
            <h2 className="splash-title">Welcome to Reflect 🌿</h2>
            <p className="splash-text">
              Your personal space to express, grow, and track your emotions.
            </p>
          </header>

          <div className="journal-card">
            <form className="journal-form" onSubmit={handleSubmit}>
              <h3 className="form-heading">Write Your Thoughts</h3>

              <textarea
                name="text"
                placeholder="How are you feeling today? Write freely..."
                value={text}
                onChange={handleChange}
                required
                maxLength={500}
                className="journal-textarea"
              ></textarea>

              <div className="char-count">{charCount}/500</div>

              <div className="mood-picker">
                <p className="mood-label">Select your mood:</p>
                <div className="mood-options">
                  {moods.map((m) => (
                    <button
                      type="button"
                      key={m.name}
                      className={`mood-btn ${mood === m.name ? "selected" : ""}`}
                      onClick={() => handleMoodChange(m.name)}
                    >
                      <span className="mood-icon">{m.icon}</span>
                      <span>{m.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="save-btn">
                Save Entry
              </button>
            </form>
          </div>
        </main>
      )}

      {/* ✅ Past Reflections Page (with Calendar) */}
      {activePage === "reflections" && (
        <section className="reflections-section">
          <h2>Past Reflections</h2>
          <p className="reflection-text">
            Here’s where your saved thoughts will appear. Each reflection helps
            you track your journey — one thought at a time.
          </p>

          {/* Calendar Component */}
          <div className="calendar-wrapper">
            <Calendar
              moodData={moodData}
              onDateSelect={onDateSelect}
              selectedDate={selectedDate}
            />
          </div>
        </section>
      )}

      {/* ✅ Footer */}
      <footer className="journal-footer">
        © {new Date().getFullYear()} Reflect. All rights reserved.
      </footer>
    </div>
  );
};

export default JournalForm;
