import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import "./ReportFilter.css";

const ReportFilter = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [mood, setMood] = useState("all");

  // Dummy reflections (replace later with DB data)
  const reflections = [
    {
      id: 1,
      title: "Grateful Morning",
      mood: "happy",
      date: "2025-10-20",
      content: "Woke up early and had a great start with yoga and gratitude journaling.",
    },
    {
      id: 2,
      title: "Tough Day",
      mood: "sad",
      date: "2025-10-22",
      content: "Had a rough day, but learned to stay patient and mindful.",
    },
    {
      id: 3,
      title: "Productive Evening",
      mood: "excited",
      date: "2025-10-25",
      content: "Completed all my tasks on time and felt accomplished!",
    },
  ];

  // Filtering logic
  const filteredReflections = reflections.filter((entry) => {
    const entryDate = new Date(entry.date);
    const isWithinDateRange =
      (!fromDate || entryDate >= new Date(fromDate)) &&
      (!toDate || entryDate <= new Date(toDate));
    const matchesMood = mood === "all" || entry.mood === mood;
    return isWithinDateRange && matchesMood;
  });

  return (
    <div className="report-page">
      <Navbar />

      <div className="report-container">
        <h1 className="report-title">📊 Reflection Reports</h1>

        {/* --- Filter Form --- */}
        <div className="filter-form">
          <div className="filter-item">
            <label>From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label>To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label>Mood:</label>
            <select value={mood} onChange={(e) => setMood(e.target.value)}>
              <option value="all">All</option>
              <option value="happy">😊 Happy</option>
              <option value="sad">😔 Sad</option>
              <option value="neutral">😐 Neutral</option>
              <option value="excited">🤩 Excited</option>
              <option value="angry">😠 Angry</option>
            </select>
          </div>
        </div>

        {/* --- Reflection List --- */}
        <div className="reflection-list">
          {filteredReflections.length > 0 ? (
            filteredReflections.map((entry) => (
              <div key={entry.id} className="reflection-card">
                <div className="reflection-header">
                  <h3>{entry.title}</h3>
                  <span className={`mood-tag ${entry.mood}`}>{entry.mood}</span>
                </div>
                <p className="reflection-date">{entry.date}</p>
                <p className="reflection-content">{entry.content}</p>
              </div>
            ))
          ) : (
            <p className="no-results">No reflections found for this filter.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportFilter;
