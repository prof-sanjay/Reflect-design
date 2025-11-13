import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./MentalInsights.css";

/* -----------------------------
   API Helper
----------------------------- */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiFetch = async (endpoint) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

/* -----------------------------
   Mood Score System
----------------------------- */
const moodScore = {
  Happy: 5,
  Excited: 4,
  Neutral: 3,
  Anxious: 2,
  Sad: 1,
  Angry: 1,
};

const COLORS = ["#ffc658", "#82ca9d", "#8884d8", "#ff7f7f", "#a95de6", "#6fb1fc"];

/* -----------------------------
   Main Component
----------------------------- */
const MentalInsights = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchReflections();
  }, []);

  const fetchReflections = async () => {
    const reflections = await apiFetch("/reflections");
    setData(reflections);
  };

  /* -------------------------------------------------------
     1️⃣ Mood Trend Line Chart (date → mood score)
  ------------------------------------------------------- */
  const moodTrendData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString(),
    score: moodScore[item.mood] || 0,
  }));

  /* -------------------------------------------------------
     2️⃣ Mood Distribution Pie Chart
  ------------------------------------------------------- */
  const moodCounts = data.reduce((acc, item) => {
    acc[item.mood] = (acc[item.mood] || 0) + 1;
    return acc;
  }, {});

  const moodPieData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood,
    value: count,
  }));

  /* -------------------------------------------------------
     3️⃣ Weekly Heatmap
  ------------------------------------------------------- */
  const heatmapMatrix = {};

  data.forEach((entry) => {
    const date = new Date(entry.date);
    const week = `Week ${Math.ceil(date.getDate() / 7)}`;
    const day = date.toLocaleString("en-US", { weekday: "short" });

    if (!heatmapMatrix[week]) heatmapMatrix[week] = {};
    heatmapMatrix[week][day] = entry.mood;
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="insights-page">
      <Navbar />

      <div className="insights-container">
        <h1 className="insights-title">📈 Mental Health Insights</h1>

        {/* 1️⃣ Mood Trend Line Chart */}
        <div className="chart-card">
          <h2>Mood Trend Over Time</h2>

          <LineChart width={900} height={300} data={moodTrendData}>
            <XAxis dataKey="date" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#82ca9d" strokeWidth={3} />
          </LineChart>
        </div>

        {/* 2️⃣ Mood Distribution */}
        <div className="chart-card">
          <h2>Mood Distribution</h2>

          <PieChart width={900} height={350}>
            <Pie
              data={moodPieData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label
            >
              {moodPieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </div>

        {/* 3️⃣ Weekly Mood Heatmap */}
        <div className="chart-card">
          <h2>Weekly Mood Heatmap</h2>

          <div className="heatmap">
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
                {Object.keys(heatmapMatrix).map((week) => (
                  <tr key={week}>
                    <td>{week}</td>
                    {days.map((day) => (
                      <td key={day} className={`mood-cell mood-${heatmapMatrix[week][day]}`}>
                        {heatmapMatrix[week][day] || "-"}
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
};

export default MentalInsights;
