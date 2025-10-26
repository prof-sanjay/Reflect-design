import React, { useState } from "react";
import "./ReportFilter.css";

const ReportFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    mood: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({ startDate: "", endDate: "", mood: "" });
    onFilter({ startDate: "", endDate: "", mood: "" });
  };

return (
  <div className="journal-container">
    <header className="journal-header">
      <h1 className="journal-title">Reflect</h1>
      <p className="journal-tagline">“Your thoughts shape your tomorrow.”</p>
    </header>

    <main className="journal-content">
      <div className="journal-card">
        <form className="journal-form" onSubmit={handleSubmit}>
          <h2 className="form-heading">Write Your Thoughts</h2>

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

      <section className="past-entries">
        <h3>Past Reflections</h3>
        <p>
          Here’s where your saved thoughts will appear. Each reflection helps
          you track your journey — one thought at a time.
        </p>
      </section>
    </main>

    <footer className="journal-footer">
      © {new Date().getFullYear()} Reflect. All rights reserved.
    </footer>
  </div>
);

};

export default ReportFilter;
