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

/* -----------------------------
   API HELPER
----------------------------- */
const apiFetch = async (endpoint) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

/* -----------------------------
   Mood → Score Mapping
----------------------------- */
const moodScoreMap = {
  Happy: 5,
  Excited: 4,
  Calm: 3,
  Tired: 2,
  Sad: 2,
  Anxious: 1,
};

const COLORS = ["#c59f66", "#d4b48a", "#b39068", "#e2c8a4", "#9c815c"];

/* -----------------------------
   FIXED required constant
----------------------------- */
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* -----------------------------
   MAIN COMPONENT
----------------------------- */
export default function MentalInsights() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await apiFetch("/wellness/history");
    setHistory(Array.isArray(data) ? data : []);
  };

  /* ------------------------------------
     1️⃣ Mood Trend
  ------------------------------------ */
  const moodTrend = history.map((item) => ({
    date: item.date || "",
    score: moodScoreMap[item.mood] || 0,
  }));

  /* ------------------------------------
     2️⃣ Pie Chart Data
  ------------------------------------ */
  const pieCount = {};
  history.forEach((x) => {
    if (!x.mood) return;
    pieCount[x.mood] = (pieCount[x.mood] || 0) + 1;
  });

  const moodPieData = Object.entries(pieCount).map(([mood, value]) => ({
    name: mood,
    value,
  }));

  /* ------------------------------------
     3️⃣ Sleep Pattern
  ------------------------------------ */
  const sleepData = history.map((x) => ({
    date: x.date,
    sleep: x.sleepHours || 0,
  }));

  /* ------------------------------------
     4️⃣ Stress vs Energy
  ------------------------------------ */
  const scatterData = history.map((x) => ({
    stress: x.stressLevel || 0,
    energy: x.energyLevel || 0,
  }));

  /* ------------------------------------
     5️⃣ Water Intake
  ------------------------------------ */
  const waterData = history.map((x) => ({
    date: x.date,
    water: x.waterIntake || 0,
  }));

  /* ------------------------------------
     6️⃣ Mood Heatmap (Fixed!)
  ------------------------------------ */
  const heatMatrix = {};

  history.forEach((item) => {
    if (!item.date) return;

    const d = new Date(item.date);
    const week = `Week ${Math.ceil(d.getDate() / 7)}`;
    const day = d.toLocaleDateString("en-US", { weekday: "short" });

    if (!heatMatrix[week]) heatMatrix[week] = {};
    heatMatrix[week][day] = item.mood || "-";
  });

  /* ------------------------------------
     Average Helper
  ------------------------------------ */
  const avg = (arr, key) => {
    if (!arr.length) return 0;
    const sum = arr.reduce((a, b) => a + (b[key] || 0), 0);
    return (sum / arr.length).toFixed(1);
  };

  return (
    <div className="insights-page">
      <Navbar />
      <div className="insights-container">

        <h1 className="insights-title">📊 Mental Health Insights</h1>

        {/* SUMMARY CARDS */}
        <div className="summary-grid">
          <div className="summary-card">
            <h3>Avg Sleep</h3>
            <p>{avg(history, "sleepHours")} hrs</p>
          </div>

          <div className="summary-card">
            <h3>Avg Stress</h3>
            <p>{avg(history, "stressLevel")}/10</p>
          </div>

          <div className="summary-card">
            <h3>Avg Energy</h3>
            <p>{avg(history, "energyLevel")}/10</p>
          </div>

          <div className="summary-card">
            <h3>Water Intake</h3>
            <p>{avg(history, "waterIntake")} L</p>
          </div>
        </div>

        {/* MOOD TREND */}
        <div className="chart-card">
          <h2>😊 Mood Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={moodTrend}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#c59f66" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="chart-card">
          <h2>🎭 Mood Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={moodPieData} dataKey="value" nameKey="name" outerRadius={110} label>
                {moodPieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
                  <stop offset="5%" stopColor="#d4b48a" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#d4b48a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area dataKey="sleep" stroke="#b39068" fill="url(#sleepFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* STRESS vs ENERGY */}
        <div className="chart-card">
          <h2>⚡ Stress vs Energy</h2>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart>
              <XAxis dataKey="stress" />
              <YAxis dataKey="energy" />
              <Tooltip />
              <Scatter data={scatterData} fill="#c59f66" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* WATER INTAKE */}
        <div className="chart-card">
          <h2>💧 Water Intake</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={waterData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="water" fill="#d4b48a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* HEATMAP */}
        <div className="chart-card">
          <h2>🔥 Weekly Mood Heatmap</h2>

          <div className="heatmap-grid">
            <table>
              <thead>
                <tr>
                  <th>Week</th>
                  {days.map((d) => (
                    <th key={d}>{d}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {Object.keys(heatMatrix).map((week) => (
                  <tr key={week}>
                    <td>{week}</td>
                    {days.map((day) => (
                      <td key={day} className={`heat-cell mood-${heatMatrix[week][day] || "none"}`}>
                        {heatMatrix[week][day] || "-"}
                      </td>
                    ))}
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
