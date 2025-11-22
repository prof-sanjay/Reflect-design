// fe/src/pages/Analytics.jsx
import React, { useState, useEffect } from "react";
import {
  getWeeklyAnalytics,
  getMonthlyAnalytics,
  getWellnessHistory
} from "../utils/api";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter
} from "recharts";

import "../styles/Analytics.css";

const Dashboard = () => {
  const [period, setPeriod] = useState("week");
  const [analytics, setAnalytics] = useState(null);
  const [wellnessData, setWellnessData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ------------------------------------------------------------
  // 🔵 Load data whenever period changes
  // ------------------------------------------------------------
  useEffect(() => {
    loadAnalytics();
    loadWellnessData();
  }, [period]);

  // Fetch analytics summary
  const loadAnalytics = async () => {
    try {
      const data =
        period === "week"
          ? await getWeeklyAnalytics()
          : await getMonthlyAnalytics();

      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    }
  };

  // Fetch wellness entries
  const loadWellnessData = async () => {
    try {
      setLoading(true);
      const limit = period === "week" ? 7 : 30;
      const data = await getWellnessHistory(limit);

      setWellnessData(data);
    } catch (error) {
      console.error("Failed to load wellness data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // 🔵 Merge duplicate dates correctly
  // ------------------------------------------------------------
  const mergeByDate = () => {
    const grouped = {};

    wellnessData.forEach((entry) => {
      const day = entry.date.split("T")[0]; // yyyy-mm-dd

      if (!grouped[day]) {
        grouped[day] = {
          date: day,
          sleep: entry.sleepHours || 0,
          energy: entry.energyLevel || 0,
          stress: entry.stressLevel || 0,
          count: 1
        };
      } else {
        grouped[day].sleep += entry.sleepHours || 0;
        grouped[day].energy += entry.energyLevel || 0;
        grouped[day].stress += entry.stressLevel || 0;
        grouped[day].count++;
      }
    });

    // Convert back to array with averaging
    return Object.values(grouped)
      .map((e) => ({
        date: new Date(e.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        }),
        sleep: +(e.sleep / e.count).toFixed(1),
        energy: +(e.energy / e.count).toFixed(1),
        stress: +(e.stress / e.count).toFixed(1)
      }))
      .sort(
        (a, b) =>
          new Date(a.date + " 2024") - new Date(b.date + " 2024")
      ); // force correct ordering
  };

  const mergedData = mergeByDate();

  // ------------------------------------------------------------
  // 🔵 Final Chart Data
  // ------------------------------------------------------------
  const sleepTrendData = mergedData.map((e) => ({
    date: e.date,
    sleep: e.sleep,
    energy: e.energy,
    stress: e.stress
  }));

  const sleepDistributionData = [
    { name: "Less than 6h", value: mergedData.filter((e) => e.sleep < 6).length },
    { name: "6-8h", value: mergedData.filter((e) => e.sleep >= 6 && e.sleep <= 8).length },
    { name: "More than 8h", value: mergedData.filter((e) => e.sleep > 8).length }
  ];

  const sleepEnergyData = mergedData.map((e) => ({
    sleep: e.sleep,
    energy: e.energy
  }));

  // Mood Colors
  const COLORS = {
    happy: "#4ade80",
    sad: "#60a5fa",
    angry: "#f87171",
    anxious: "#fbbf24",
    calm: "#a78bfa",
    excited: "#fb923c",
    neutral: "#94a3b8"
  };

  const moodChartData = analytics?.moodDistribution
    ? Object.entries(analytics.moodDistribution).map(([mood, count]) => ({
        name: mood,
        value: count,
        fill: COLORS[mood.toLowerCase()] || "#cbd5e1"
      }))
    : [];

  // ------------------------------------------------------------
  // 🔵 Summary values
  // ------------------------------------------------------------
  const avgSleep =
    mergedData.length > 0
      ? (mergedData.reduce((a, b) => a + b.sleep, 0) / mergedData.length).toFixed(1)
      : 0;

  const avgEnergy =
    mergedData.length > 0
      ? (mergedData.reduce((a, b) => a + b.energy, 0) / mergedData.length).toFixed(1)
      : 0;

  const avgStress =
    mergedData.length > 0
      ? (mergedData.reduce((a, b) => a + b.stress, 0) / mergedData.length).toFixed(1)
      : 0;

  const getSleepQuality = (h) => {
    if (h >= 8) return "Excellent";
    if (h >= 7) return "Good";
    if (h >= 6) return "Fair";
    return "Poor";
  };

  const getSleepColor = (h) => {
    if (h >= 8) return "#4ade80";
    if (h >= 7) return "#a78bfa";
    if (h >= 6) return "#fbbf24";
    return "#f87171";
  };

  // ------------------------------------------------------------
  // 🔵 UI
  // ------------------------------------------------------------
  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>📊 Dashboard</h1>

        <div className="period-selector">
          <button
            className={period === "week" ? "active" : ""}
            onClick={() => setPeriod("week")}
          >
            Weekly
          </button>

          <button
            className={period === "month" ? "active" : ""}
            onClick={() => setPeriod("month")}
          >
            Monthly
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      )}

      {!loading && analytics && (
        <>
          {/* Top Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Reflections</h3>
              <p className="stat-number">{analytics.reflectionCount}</p>
            </div>

            <div className="stat-card">
              <h3>Wellness Entries</h3>
              <p className="stat-number">{analytics.wellnessEntries}</p>
            </div>

            <div className="stat-card">
              <h3>Avg Sleep</h3>
              <p className="stat-number" style={{ color: getSleepColor(avgSleep) }}>
                {avgSleep}h
              </p>
              <span>Quality: {getSleepQuality(avgSleep)}</span>
            </div>

            <div className="stat-card">
              <h3>Avg Energy</h3>
              <p className="stat-number">{avgEnergy}/10</p>
            </div>
          </div>

          {/* Charts */}
          <div className="charts-grid">

            {/* Sleep Trend */}
            <div className="chart-card">
              <h3>😴 Sleep Trend Analysis</h3>

              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={sleepTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 12]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="sleep" stroke="#8b5cf6" fill="#e9d5ff" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Sleep Distribution */}
            <div className="chart-card">
              <h3>📊 Sleep Distribution</h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sleepDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    dataKey="value"
                  >
                    <Cell fill="#4ade80" />
                    <Cell fill="#a78bfa" />
                    <Cell fill="#f87171" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Sleep vs Energy */}
            <div className="chart-card">
              <h3>⚡ Sleep vs Energy</h3>

              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="sleep" name="Sleep Hours" domain={[0, 12]} />
                  <YAxis type="number" dataKey="energy" name="Energy Level" domain={[0, 10]} />
                  <Tooltip />
                  <Scatter data={sleepEnergyData} fill="#8b5cf6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Mood */}
            <div className="chart-card">
              <h3>🎭 Mood Distribution</h3>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moodChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {moodChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Sleep vs Stress */}
            <div className="chart-card">
              <h3>⚖️ Sleep vs Stress</h3>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sleepTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" domain={[0, 12]} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sleep" fill="#8b5cf6" />
                  <Bar yAxisId="right" dataKey="stress" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
