// MentalInsights.jsx
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "./Navbar";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
} from "recharts";

import "./MentalInsights.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/* ---------------- API helper ---------------- */
const apiFetch = async (endpoint) => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      // return empty array for consistency
      return [];
    }
    return res.json();
  } catch (err) {
    console.error("API fetch error:", err);
    return [];
  }
};

/* ---------------- maps ---------------- */
const moodScoreMap = {
  Happy: 5,
  Excited: 4,
  Calm: 3,
  Tired: 2,
  Sad: 2,
  Anxious: 1,
};

const moodColorMap = {
  Happy: "#3AD07A",
  Excited: "#7BDD57",
  Calm: "#FFD166",
  Tired: "#FFB26B",
  Sad: "#FF8A8A",
  Anxious: "#FF6B6B",
};

/* ---------------- Date helpers (NO TIMEZONE DRIFT) ----------------
   Reason: `new Date("2025-11-20")` can be interpreted as UTC and shift
   depending on runtime timezone. To avoid that, when input is "YYYY-MM-DD"
   we construct Date(year, month-1, day) which uses local calendar date.
------------------------------------------------------------------------ */
const parseDateSafe = (raw) => {
  if (!raw) return null;
  if (typeof raw !== "string") return null;

  // 1) plain date 'YYYY-MM-DD' -> treat as local date at midnight
  const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/;
  if (isoDateOnly.test(raw)) {
    const [y, m, d] = raw.split("-").map((s) => Number(s));
    return new Date(y, m - 1, d); // local date at 00:00
  }

  // 2) full ISO or other strings -> create Date and normalize to local date (drop time)
  const dt = new Date(raw);
  if (isNaN(dt.getTime())) return null;
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
};

// short friendly date
const fmtShort = (d) =>
  d ? d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "";

/* ---------------- small helpers ---------------- */
const avg = (arr, key) => {
  if (!arr || arr.length === 0) return 0;
  const total = arr.reduce((acc, x) => acc + Number(x[key] || 0), 0);
  return +(total / arr.length).toFixed(1);
};

/* ---------------- MAIN COMPONENT ---------------- */
export default function MentalInsights() {
  const [history, setHistory] = useState([]); // raw records from API
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await apiFetch("/wellness/history");
      if (!mounted) return;

      // Clean and parse dates safely, then sort ascending by calendar date
      const cleaned = (Array.isArray(data) ? data : []).map((r) => {
        const parsed = parseDateSafe(r?.date);
        return { ...r, __parsedDate: parsed };
      });
      cleaned.sort((a, b) => {
        const ta = a.__parsedDate ? a.__parsedDate.getTime() : Infinity;
        const tb = b.__parsedDate ? b.__parsedDate.getTime() : Infinity;
        return ta - tb;
      });

      setHistory(cleaned);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* memoized derived datasets for charts */
  const { moodTrend, sleepData, scatterData, waterData, pieData } = useMemo(() => {
    const moodTrend = history.map((h) => ({
      date: fmtShort(h.__parsedDate),
      score: moodScoreMap[h.mood] || 0,
      mood: h.mood || "—",
    }));

    const sleepData = history.map((h) => ({
      date: fmtShort(h.__parsedDate),
      sleep: Number(h.sleepHours || 0),
    }));

    const scatterData = history.map((h) => ({
      stress: Number(h.stressLevel || 0),
      energy: Number(h.energyLevel || 0),
    }));

    const waterData = history.map((h) => ({
      date: fmtShort(h.__parsedDate),
      water: Number(h.waterIntake || 0),
    }));

    const pieCount = {};
    history.forEach((h) => {
      if (!h.mood) return;
      pieCount[h.mood] = (pieCount[h.mood] || 0) + 1;
    });
    const pieData = Object.entries(pieCount).map(([name, value]) => ({
      name,
      value,
      color: moodColorMap[name] || "#DDD",
    }));

    return { moodTrend, sleepData, scatterData, waterData, pieData };
  }, [history]);

  // Small skeleton when loading
  if (loading) {
    return (
      <div className="insights-app">
        <Navbar />
        <main className="insights-shell">
          <div className="loading-shell">
            <div className="loader" aria-hidden />
            <div className="loading-text">Loading insights…</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="insights-app">
      <Navbar />

      <main className="insights-shell" aria-live="polite">
        {/* Header */}
        <div className="header-row">
          <div className="title-col">
            <h1 className="insights-title">Mental Insights — Premium</h1>
            <p className="insights-lead">
              Beautiful, reliable visualizations of your mood, sleep, stress and hydration.
            </p>
          </div>

          <div className="summary-col" role="region" aria-label="summary">
            <div className="summary-card big">
              <div className="card-label">Avg Sleep</div>
              <div className="card-value">{avg(history, "sleepHours")} hrs</div>
              <div className="card-sub">{history.length} entries</div>
            </div>

            <div className="summary-card">
              <div className="card-label">Avg Stress</div>
              <div className="card-value">{avg(history, "stressLevel")}/10</div>
            </div>

            <div className="summary-card">
              <div className="card-label">Avg Energy</div>
              <div className="card-value">{avg(history, "energyLevel")}/10</div>
            </div>

            <div className="summary-card">
              <div className="card-label">Avg Water</div>
              <div className="card-value">{avg(history, "waterIntake")} L</div>
            </div>
          </div>
        </div>

        {/* charts grid */}
        <section className="grid-analytics" aria-label="analytics">
          {/* Mood trend (full width) */}
          <article className="card chart premium">
            <div className="card-head">
              <div>
                <h2>🌊 Mood Trend</h2>
                <div className="head-sub">Smoothed emotional score over time</div>
              </div>
            </div>

            <div className="chart-wrap" role="img" aria-label="mood trend chart">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={moodTrend}>
                  <defs>
                    <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#6C8BF6" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#6C8BF6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                  <CartesianGrid strokeDasharray="6 6" opacity={0.08} />
                  <Tooltip
                    formatter={(val, name) =>
                      name === "score" ? [`${val}/5`, "Emotional score"] : val
                    }
                    labelFormatter={(l) => `Date: ${l}`}
                  />
                  <Area type="monotone" dataKey="score" stroke="#4A62E0" fill="url(#g1)" strokeWidth={0} />
                  <Line type="monotone" dataKey="score" stroke="#2B48F8" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          {/* Pie */}
          <article className="card chart">
            <div className="card-head">
              <h2>🎭 Mood Breakdown</h2>
              <div className="head-sub">Most frequent moods</div>
            </div>

            <div className="chart-wrap" role="img" aria-label="mood breakdown">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={82}
                    label={(entry) => `${entry.name} (${entry.value})`}
                    paddingAngle={6}
                  >
                    {pieData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>

          {/* Sleep */}
          <article className="card chart">
            <div className="card-head">
              <h2>😴 Sleep Pattern</h2>
              <div className="head-sub">Hours per night</div>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={sleepData}>
                  <defs>
                    <linearGradient id="sleepFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#7F9CF5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#EAF0FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <CartesianGrid strokeDasharray="6 6" opacity={0.08} />
                  <Tooltip />
                  <Area dataKey="sleep" stroke="#4C51BF" strokeWidth={2.2} fill="url(#sleepFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          {/* Scatter Stress vs Energy */}
          <article className="card chart">
            <div className="card-head">
              <h2>⚡ Stress vs Energy</h2>
              <div className="head-sub">Daily correlation</div>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <ScatterChart>
                  <CartesianGrid opacity={0.08} />
                  <XAxis dataKey="stress" name="Stress" />
                  <YAxis dataKey="energy" name="Energy" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={scatterData} fill="#5A67D8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </article>

          {/* Water */}
          <article className="card chart">
            <div className="card-head">
              <h2>💧 Water Intake</h2>
              <div className="head-sub">Litres per day</div>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={waterData}>
                  <CartesianGrid strokeDasharray="6 6" opacity={0.08} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="water" fill="#6C8BF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
