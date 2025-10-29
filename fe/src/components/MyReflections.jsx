import React, { useState } from "react";
import Calendar from "./Calendar.jsx";
import Navbar from "./Navbar.jsx";
import ReflectionEditor from "./ReflectionEditor.jsx"; // 👈 New component
import "./MyReflections.css";

const MyReflections = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (dateKey) => {
    setSelectedDate(dateKey);
  };
  const [moodData, setMoodData] = useState({
  "2025-10-01": "happy",
  "2025-10-05": "sad",
  "2025-10-08": "calm",
  "2025-10-15": "excited",
  "2025-10-20": "anxious",
});


  return (
    <>
      <Navbar />

      <div className="my-reflections">
        <div className="reflections-layout">
          {/* Left — Calendar */}
          <div className="calendar-section">
            <Calendar
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
              moodData={moodData}
            />

          </div>

          {/* Right — Text area (separate component) */}
          <div className="reflection-editor-section">
            <ReflectionEditor selectedDate={selectedDate} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyReflections;
