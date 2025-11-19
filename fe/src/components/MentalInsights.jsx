import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import "./MentalInsights.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ----------------------------------------------------
   API Fetch Helper
---------------------------------------------------- */
const apiFetch = async (endpoint) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

/* ----------------------------------------------------
   Mood → Score Map
---------------------------------------------------- */
const moodScoreMap = {
  Happy: 5,
  Excited: 4,
  Calm: 3,
  Tired: 2,
  Sad: 2,
  Anxious: 1,
};

/* ----------------------------------------------------
   Mood → Color Map (Heatmap)
---------------------------------------------------- */
const moodColorMap = {
  Happy: "#54D66A",
  Excited: "#7BDA5D",
  Calm: "#F4C96F",
  Tired: "#F4A64F",
  Sad: "#E97E7E",
  Anxious: "#D66565",
};

/* ----------------------------------------------------
   Date formatter
---------------------------------------------------- */
const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

/* ----------------------------------------------------
   ISO Week Number Calculator (correct)
---------------------------------------------------- */
function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

/* ----------------------------------------------------
   Build Heatmap Matrix (Power BI style)
---------------------------------------------------- */
function buildHeatmap(history) {
  const matrix = {};

  history.forEach((h) => {
    if (!h.date) return;

    const d = new Date(h.date);
    const week = getWeekNumber(d);
    const weekday = d.getDay(); // 0–6

    if (!matrix[week]) matrix[week] = {};

    matrix[week][weekday] = {
      mood: h.mood,
      color: moodColorMap[h.mood] || "#DDD",
      date: formatDate(h.date),
    };
  });

  return matrix;
}

/* ----------------------------------------------------
   AVERAGE FUNCTION
---------------------------------------------------- */
const avg = (arr, key) => {
  if (!arr.length) return 0;
  const total = arr.reduce((acc, obj) => acc + (obj[key] || 0), 0);
  return (total / arr.length).toFixed(1);
};

/* ----------------------------------------------------
   MAIN COMPONENT
---------------------------------------------------- */
export default function MentalInsights() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await apiFetch("/wellness/history");
    setHistory(Array.isArray(data) ? data : []);
  };

  /* ----------------------------------------------------
     Build all visualization datasets
  ---------------------------------------------------- */
  const moodTrend = history.map((item) => ({
    date: formatDate(item.date),
    score: moodScoreMap[item.mood] || 0,
  }));

  const sleepData = history.map((x) => ({
    date: formatDate(x.date),
    sleep: x.sleepHours || 0,
  }));

  const scatterData = history.map((x) => ({
    stress: x.stressLevel || 0,
    energy: x.energyLevel || 0,
  }));

  const waterData = history.map((x) => ({
    date: formatDate(x.date),
    water: x.waterIntake || 0,
  }));

  /* PIE CHART */
  const pieCount = {};
  history.forEach((x) => {
    if (!x.mood) return;
    pieCount[x.mood] = (pieCount[x.mood] || 0) + 1;
  });

  const pieData = Object.entries(pieCount).map(([m, v]) => ({
    name: m,
    value: v,
    color: moodColorMap[m],
  }));

  /* HEATMAP */
  const heatmap = buildHeatmap(history);

  /* ----------------------------------------------------
     RENDER
  ---------------------------------------------------- */

  return (
    <div className="insights-page">
      <Navbar />

      <div className="insights-container">
        <h1 className="insights-title">📊 Advanced Mental Health Analytics</h1>

        {/* SUMMARY CARDS */}
        <div className="summary-grid">
          <div className="summary-card"><h3>Avg Sleep</h3><p>{avg(history, "sleepHours")} hrs</p></div>
          <div className="summary-card"><h3>Avg Stress</h3><p>{avg(history, "stressLevel")}/10</p></div>
          <div className="summary-card"><h3>Avg Energy</h3><p>{avg(history, "energyLevel")}/10</p></div>
          <div className="summary-card"><h3>Water Intake</h3><p>{avg(history, "waterIntake")} L</p></div>
        </div>

        {/* MOOD TREND */}
        <div className="chart-card premium">
          <h2>🌊 Mood Trend (Smooth Curve)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodTrend}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <Line type="natural" dataKey="score" stroke="#5A67D8" strokeWidth={4} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="chart-card">
          <h2>🎭 Mood Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={110} label>
                {pieData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* SLEEP */}
        <div className="chart-card">
          <h2>😴 Sleep Pattern</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={sleepData}>
              <defs>
                <linearGradient id="sleepFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7F9CF5" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#CBD5E0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area dataKey="sleep" stroke="#4C51BF" strokeWidth={3} fill="url(#sleepFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* SCATTER */}
        <div className="chart-card">
          <h2>⚡ Stress vs Energy</h2>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart>
              <CartesianGrid opacity={0.2} />
              <XAxis dataKey="stress" />
              <YAxis dataKey="energy" />
              <Tooltip />
              <Scatter data={scatterData} fill="#5A67D8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* WATER */}
        <div className="chart-card">
          <h2>💧 Water Intake Pattern</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={waterData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="water" fill="#7F9CF5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* HEATMAP */}
        <div className="chart-card">
          <h2>🔥 Weekly Mood Heatmap (Power BI Style)</h2>

          <div className="heatmap-grid-adv">
            <table>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Mon</th><th>Tue</th><th>Wed</th>
                  <th>Thu</th><th>Fri</th><th>Sat</th><th>Sun</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(heatmap).map((week) => (
                  <tr key={week}>
                    <td className="week-col">{week}</td>

                    {[1,2,3,4,5,6,0].map((day) => {
                      const cell = heatmap[week][day];
                      return (
                        <td
                          key={day}
                          className="heat-cell-adv"
                          style={{
                            background: cell ? cell.color : "#EFEFEF",
                          }}
                        >
                          {cell ? (
                            <>
                              <div className="mood-label">{cell.mood}</div>
                              <div className="date-label">{cell.date}</div>
                            </>
                          ) : "-"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
