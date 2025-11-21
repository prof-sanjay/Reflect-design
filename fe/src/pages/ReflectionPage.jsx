// fe/src/pages/ReflectionPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ReflectionPage.css";

const ReflectionPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [reflections, setReflections] = useState([]);
  const [todayReflection, setTodayReflection] = useState(null);
  const [formData, setFormData] = useState({
    mood: "",
    entry: "",
    gratitude: "",
    goals: "",
  });
  const [loading, setLoading] = useState(false);

  const moodColors = {
    happy: "#10b981",
    sad: "#3b82f6",
    anxious: "#f59e0b",
    angry: "#ef4444",
    calm: "#8b5cf6",
    excited: "#ec4899",
    neutral: "#6b7280",
  };

  useEffect(() => {
    loadReflections();
  }, []);

  useEffect(() => {
    loadReflectionForDate(selectedDate);
  }, [selectedDate]);

  const loadReflections = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5003/api/reflections", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReflections(response.data);
    } catch (error) {
      console.error("Failed to load reflections:", error);
    }
  };

  const loadReflectionForDate = async (date) => {
    try {
      const token = localStorage.getItem("token");
      const dateStr = date.toISOString().split("T")[0];
      const response = await axios.get(
        `http://localhost:5003/api/reflections/date/${dateStr}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data) {
        setTodayReflection(response.data);
        setFormData({
          mood: response.data.mood || "",
          entry: response.data.entry || "",
          gratitude: response.data.gratitude || "",
          goals: response.data.goals || "",
        });
      } else {
        setTodayReflection(null);
        setFormData({ mood: "", entry: "", gratitude: "", goals: "" });
      }
    } catch (error) {
      setTodayReflection(null);
      setFormData({ mood: "", entry: "", gratitude: "", goals: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const dateStr = selectedDate.toISOString().split("T")[0];
      
      if (todayReflection) {
        // Update existing reflection
        await axios.put(
          `http://localhost:5003/api/reflections/${todayReflection._id}`,
          { ...formData, date: dateStr },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new reflection
        await axios.post(
          "http://localhost:5003/api/reflections",
          { ...formData, date: dateStr },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      await loadReflections();
      await loadReflectionForDate(selectedDate);
      alert("Reflection saved successfully!");
    } catch (error) {
      console.error("Failed to save reflection:", error);
      alert("Failed to save reflection");
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getMoodForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const reflection = reflections.find(
      (r) => r.date && r.date.startsWith(dateStr)
    );
    return reflection?.mood || null;
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
    const days = [];
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Week day headers
    weekDays.forEach((day) => {
      days.push(
        <div key={`header-${day}`} className="calendar-day-header">
          {day}
        </div>
      );
    });

    // Empty cells before first day
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const mood = getMoodForDate(date);
      const isSelected =
        date.toDateString() === selectedDate.toDateString();
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? "selected" : ""} ${
            isToday ? "today" : ""
          }`}
          style={{
            backgroundColor: mood ? moodColors[mood] : "transparent",
            color: mood ? "white" : "#1f2937",
          }}
          onClick={() => setSelectedDate(date)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="reflection-page">
      <div className="reflection-container">
        {/* Calendar Section */}
        <div className="calendar-section">
          <div className="calendar-header">
            <button onClick={() => changeMonth(-1)} className="month-nav">
              ◀
            </button>
            <h2>
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button onClick={() => changeMonth(1)} className="month-nav">
              ▶
            </button>
          </div>

          <div className="calendar-grid">{renderCalendar()}</div>

          <div className="mood-legend">
            <h4>Mood Colors:</h4>
            <div className="legend-items">
              {Object.entries(moodColors).map(([mood, color]) => (
                <div key={mood} className="legend-item">
                  <div
                    className="legend-color"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span>{mood}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reflection Form Section */}
        <div className="reflection-form-section">
          <h1>
            📝 Daily Reflection
            <span className="selected-date">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </h1>

          {todayReflection && (
            <div className="reflection-status">
              ✅ Reflection exists for this date
            </div>
          )}

          <form onSubmit={handleSubmit} className="reflection-form">
            <div className="form-group">
              <label>How are you feeling today?</label>
              <select
                value={formData.mood}
                onChange={(e) =>
                  setFormData({ ...formData, mood: e.target.value })
                }
                required
              >
                <option value="">Select your mood</option>
                <option value="happy">😊 Happy</option>
                <option value="sad">😢 Sad</option>
                <option value="anxious">😰 Anxious</option>
                <option value="angry">😠 Angry</option>
                <option value="calm">😌 Calm</option>
                <option value="excited">🤩 Excited</option>
                <option value="neutral">😐 Neutral</option>
              </select>
            </div>

            <div className="form-group">
              <label>What's on your mind?</label>
              <textarea
                value={formData.entry}
                onChange={(e) =>
                  setFormData({ ...formData, entry: e.target.value })
                }
                placeholder="Write your thoughts, feelings, and experiences..."
                rows="6"
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>What are you grateful for today?</label>
              <textarea
                value={formData.gratitude}
                onChange={(e) =>
                  setFormData({ ...formData, gratitude: e.target.value })
                }
                placeholder="List things you're thankful for..."
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Goals for today/tomorrow</label>
              <textarea
                value={formData.goals}
                onChange={(e) =>
                  setFormData({ ...formData, goals: e.target.value })
                }
                placeholder="What do you want to achieve?"
                rows="3"
              ></textarea>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Saving..." : todayReflection ? "Update Reflection" : "Save Reflection"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReflectionPage;
