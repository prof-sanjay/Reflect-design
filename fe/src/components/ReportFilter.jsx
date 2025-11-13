import React, { useState, useEffect } from "react";
import Navbar from "./Navbar.jsx";
import "./ReportFilter.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* -------------------------
   🔐 Logout Helper
------------------------- */
const handleLogout = () => {
  localStorage.clear();
  alert("Session expired. Please log in again.");
  window.location.href = "/";
};

/* -------------------------
   🌐 API Helper
------------------------- */
const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  if (!token) return handleLogout();

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401) handleLogout();
  return response;
};

/* ======================================================
   📊 ReportFilter Component
====================================================== */
const ReportFilter = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [mood, setMood] = useState("all");
  const [reflections, setReflections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------------------------------------------------
     📌 Fetch Reflections with Filters
  ---------------------------------------------------------- */
  const fetchReflections = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);
      if (mood !== "all") params.append("mood", mood);

      // 🟢 FIX: prevent sending "/reflections?" with empty parameters
      const query = params.toString();
      const endpoint = query ? `/reflections?${query}` : `/reflections`;

      console.log("CLIENT CALLING:", endpoint);

      const res = await apiFetch(endpoint);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setReflections(data);

      console.log("CLIENT RECEIVED:", data);

    } catch (err) {
      console.error("Fetch error:", err.message);
      setError("Failed to fetch reflections");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------------
     🔄 Re-fetch on filter change
  ---------------------------------------------------------- */
  useEffect(() => {
    fetchReflections();
  }, [fromDate, toDate, mood]);

  /* ---------------------------------------------------------
     🎨 UI Rendering
  ---------------------------------------------------------- */
  return (
    <div className="report-page">
      <Navbar />

      <div className="report-container">
        <h1 className="report-title">📊 Reflection Reports</h1>

        {/* 🔍 FILTERS */}
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
              <option value="Happy">😊 Happy</option>
              <option value="Sad">😔 Sad</option>
              <option value="Neutral">😐 Neutral</option>
              <option value="Angry">😠 Angry</option>
              <option value="Excited">🤩 Excited</option>
              <option value="Anxious">😰 Anxious</option>
            </select>
          </div>
        </div>

        {/* 📝 REFLECTION LIST */}
        <div className="reflection-list">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-text">{error}</p>
          ) : reflections.length > 0 ? (
            reflections.map((r) => (
              <div key={r._id} className="reflection-card">
                <div className="reflection-header">
                  <h3>Reflection</h3>
                  <span className={`mood-tag mood-${r.mood}`}>{r.mood}</span>
                </div>

                <p className="reflection-date">
                  {new Date(r.date).toLocaleDateString()}
                </p>

                <p className="reflection-content">{r.content}</p>
              </div>
            ))
          ) : (
            <p className="no-results">No reflections found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportFilter;
