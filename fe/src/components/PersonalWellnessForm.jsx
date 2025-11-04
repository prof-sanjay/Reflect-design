import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ for redirection
import "./PersonalWellnessForm.css";
import Navbar from "./Navbar.jsx";

const API_URL = "http://localhost:5000/api/wellness";

const PersonalWellnessForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hobbies: [],
    sleepHours: "",
    studyHours: "",
    exerciseMinutes: "",
    meditation: false,
    reading: false,
    hydration: false,
    mood: "",
    stressLevel: "",
    energyLevel: "",
    waterIntake: "",
  });

  const hobbyOptions = [
    "Reading",
    "Music",
    "Sports",
    "Art",
    "Gaming",
    "Travel",
    "Cooking",
    "Yoga",
  ];

  const moods = ["Happy", "Calm", "Anxious", "Sad", "Excited", "Tired"];

  // ✅ Redirect to login if token missing
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Please log in to access the wellness form.");
      navigate("/"); // redirect to login page
    } else {
      fetchWellnessData(token);
    }
  }, [navigate]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && hobbyOptions.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        hobbies: checked
          ? [...prev.hobbies, name]
          : prev.hobbies.filter((h) => h !== name),
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ✅ Fetch existing wellness data for logged-in user
  const fetchWellnessData = async (token) => {
    try {
      const res = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.clear();
        navigate("/");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch wellness data");

      const data = await res.json();
      if (data) setFormData((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error("❌ Error fetching wellness data:", err.message);
    }
  };

  // ✅ Save form data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      navigate("/");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.clear();
        navigate("/");
        return;
      }

      if (!res.ok) throw new Error("Failed to save wellness data");

      alert("✅ Your wellness data has been saved successfully!");
    } catch (err) {
      console.error("❌ Error saving wellness data:", err.message);
      alert("Failed to save wellness data. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="wellness-container">
        <h1 className="page-title">🌿 Personal Wellness & Lifestyle Tracker</h1>

        <form className="wellness-form" onSubmit={handleSubmit}>
          {/* Hobbies */}
          <section className="form-section">
            <h2>Hobbies</h2>
            <div className="checkbox-group">
              {hobbyOptions.map((hobby) => (
                <label key={hobby}>
                  <input
                    type="checkbox"
                    name={hobby}
                    checked={formData.hobbies.includes(hobby)}
                    onChange={handleChange}
                  />
                  {hobby}
                </label>
              ))}
            </div>
          </section>

          {/* Daily Routine */}
          <section className="form-section">
            <h2>Daily Routine</h2>
            <div className="form-group">
              <label>Sleep Hours (per day)</label>
              <input
                type="number"
                name="sleepHours"
                value={formData.sleepHours}
                onChange={handleChange}
                placeholder="e.g. 7"
              />
            </div>
            <div className="form-group">
              <label>Study Hours (per day)</label>
              <input
                type="number"
                name="studyHours"
                value={formData.studyHours}
                onChange={handleChange}
                placeholder="e.g. 4"
              />
            </div>
            <div className="form-group">
              <label>Exercise Minutes (per day)</label>
              <input
                type="number"
                name="exerciseMinutes"
                value={formData.exerciseMinutes}
                onChange={handleChange}
                placeholder="e.g. 30"
              />
            </div>
          </section>

          {/* Habit Tracker */}
          <section className="form-section">
            <h2>Habit Tracker</h2>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="meditation"
                  checked={formData.meditation}
                  onChange={handleChange}
                />
                Meditation
              </label>
              <label>
                <input
                  type="checkbox"
                  name="reading"
                  checked={formData.reading}
                  onChange={handleChange}
                />
                Reading
              </label>
              <label>
                <input
                  type="checkbox"
                  name="hydration"
                  checked={formData.hydration}
                  onChange={handleChange}
                />
                Drank 2L+ Water
              </label>
            </div>
          </section>

          {/* Wellness Log */}
          <section className="form-section">
            <h2>Wellness & Health Log</h2>
            <div className="form-group">
              <label>Mood</label>
              <select name="mood" value={formData.mood} onChange={handleChange}>
                <option value="">Select Mood</option>
                {moods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Stress Level (1–10)</label>
              <input
                type="number"
                name="stressLevel"
                value={formData.stressLevel}
                onChange={handleChange}
                min="1"
                max="10"
              />
            </div>

            <div className="form-group">
              <label>Energy Level (1–10)</label>
              <input
                type="number"
                name="energyLevel"
                value={formData.energyLevel}
                onChange={handleChange}
                min="1"
                max="10"
              />
            </div>

            <div className="form-group">
              <label>Water Intake (litres)</label>
              <input
                type="number"
                name="waterIntake"
                value={formData.waterIntake}
                onChange={handleChange}
                placeholder="e.g. 2.5"
              />
            </div>
          </section>

          <button type="submit" className="save-btn">
            💾 Save Wellness Data
          </button>
        </form>

        {/* Preview */}
        <div className="summary-section">
          <h3>Your Current Summary</h3>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      </div>
    </>
  );
};

export default PersonalWellnessForm;
