import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import "./ReportFilter.css";

/**
 * ✅ Base API URL (environment-based for easy deploy)
 */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * 🔐 Logout Helper
 */
const handleLogout = () => {
  localStorage.clear();
  alert("Session expired. Please log in again.");
  window.location.href = "/";
};

/**
 * 🌐 Centralized API Helper — adds token automatically
 */
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  if (!token) return handleLogout();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) handleLogout();
  return res;
};

/**
 * 📊 ReportFilter Component
 * Displays user’s reflections filtered by date and mood.
 */
const ReportFilter = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [mood, setMood] = useState("all");
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * ✅ Fetch reflections for logged-in user with filters
   */
  const fetchReflections = async () => {
    try {
      setLoading(true);
      setError("");

      // Build query string dynamically
      const params = new URLSearchParams();
      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);
      if (mood !== "all") params.append("mood", mood);

      const res = await apiFetch(`/reflections?${params.toString()}`, {
        method: "GET",
      });

      if (!res.ok) throw new Error("Failed to fetch reflections");
      const data = await res.json();
      setReflections(data);
    } catch (err) {
      console.error("❌ Error fetching reflections:", err.message);
      setError("Failed to fetch reflections. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔁 Re-fetch whenever filters change
   */
  useEffect(() => {
    fetchReflections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, mood]);

  // 🧱 UI Rendering
  return (
    <div className="report-page">
      <Navbar />

      <div className="report-container">
        <h1 className="report-title">📊 Reflection Reports</h1>

        {/* 🎯 Filter Section */}
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

        {/* 🧾 Reflections List */}
        <div className="reflection-list">
          {loading ? (
            <p className="loading-text">Loading reflections...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : reflections.length > 0 ? (
            reflections.map((entry) => (
              <div key={entry._id} className="reflection-card">
                <div className="reflection-header">
                  <h3>{entry.title || "Untitled Reflection"}</h3>
                  <span className={`mood-tag ${entry.mood}`}>
                    {entry.mood || "N/A"}
                  </span>
                </div>
                <p className="reflection-date">
                  {new Date(entry.date).toLocaleDateString()}
                </p>
                <p className="reflection-content">
                  {entry.content || entry.text || "No content provided."}
                </p>
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
