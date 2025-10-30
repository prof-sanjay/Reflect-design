import React, { useState, useEffect } from "react";
import Calendar from "./Calendar.jsx";
import Navbar from "./Navbar.jsx";
import ReflectionEditor from "./ReflectionEditor.jsx";
import "./MyReflections.css";

const MyReflections = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [moodData, setMoodData] = useState({
    "2025-10-01": "happy",
    "2025-10-05": "sad",
    "2025-10-08": "calm",
    "2025-10-15": "excited",
    "2025-10-20": "anxious",
  });

  const handleDateSelect = (dateKey) => {
    setSelectedDate(dateKey);
  };

  useEffect(() => {
    // Fetch prompts stored in Profile.jsx
    const storedPrompts = JSON.parse(localStorage.getItem("journalPrompts")) || [];
    setPrompts(storedPrompts);
  }, []);

  return (
    <>
      <Navbar />

      <div className="my-reflections">
        <div className="reflections-layout">
          {/* Left — Calendar + Prompts */}
          <div className="calendar-section">
            <Calendar
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
              moodData={moodData}
            />

            {/* Prompts Section Below Calendar */}
            <div className="prompts-section">
              <h2 className="prompts-heading">Prompts</h2>
              <ul className="prompts-list">
                {prompts.length > 0 ? (
                  prompts.map((prompt, index) => (
                    <li key={index} className="prompt-item">
                      - {prompt}
                    </li>
                  ))
                ) : (
                  <li className="prompt-item">
                    No prompts available. Add some in your profile!
                  </li>
                )}
              </ul>
              <p className="goals-text">Did you check your goals?</p>
            </div>
          </div>

          {/* Right — Reflection Editor */}
          <div className="reflection-editor-section">
            <ReflectionEditor selectedDate={selectedDate} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyReflections;
