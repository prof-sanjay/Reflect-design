import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import "./ReportFilter.css";
import axios from "axios";

const ReportFilter = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [mood, setMood] = useState("all");
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch reflections from backend with filters
  const fetchReflections = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get("http://localhost:5000/api/reflections", {
        params: { fromDate, toDate, mood },
      });
      setReflections(response.data);
    } catch (err) {
      console.error("❌ Failed to fetch reflections:", err);
      setError("Failed to fetch reflections from server.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Re-fetch whenever filters change
  useEffect(() => {
    fetchReflections();
  }, [fromDate, toDate, mood]);

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
          {loading ? (
            <p className="loading-text">Loading reflections...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : reflections.length > 0 ? (
            reflections.map((entry) => (
              <div key={entry._id} className="reflection-card">
                <div className="reflection-header">
                  <h3>{entry.title}</h3>
                  <span className={`mood-tag ${entry.mood}`}>{entry.mood}</span>
                </div>
                <p className="reflection-date">
                  {new Date(entry.date).toLocaleDateString()}
                </p>
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
