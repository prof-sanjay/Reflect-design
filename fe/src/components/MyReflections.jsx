import React, { useState } from "react";
import Calendar from "./Calendar.jsx";
import "./MyReflections.css";
import Navbar from "./Navbar.jsx";

const MyReflections = () => {
  // Example static reflection data
  const [moodData, setMoodData] = useState({
    "2025-10-01": "happy",
    "2025-10-05": "sad",
    "2025-10-08": "calm",
    "2025-10-15": "excited",
    "2025-10-20": "anxious",
  });

  const [reflections, setReflections] = useState({
    "2025-10-01": "Had a great day! Finished my project early.",
    "2025-10-05": "Felt down today, but went for a walk to clear my mind.",
    "2025-10-08": "Peaceful day, worked on journaling habits.",
    "2025-10-15": "Excited about learning new React concepts!",
    "2025-10-20": "Bit anxious about upcoming exams.",
  });

  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (dateKey) => {
    setSelectedDate(dateKey);
  };

  return (
    <>
    <Navbar/>
    <div className="my-reflections">

      <div className="reflections-layout">
        {/* Calendar section */}
        <div className="calendar-section">
          <Calendar
            moodData={moodData}
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
          />
        </div>

        {/* Reflection display section */}
        <div className="reflection-details">
          {selectedDate && reflections[selectedDate] ? (
            <div className="reflection-card">
              <h3>{selectedDate}</h3>
              <p>{reflections[selectedDate]}</p>
            </div>
          ) : selectedDate ? (
            <div className="reflection-card empty">
              <h3>{selectedDate}</h3>
              <p>No reflection recorded for this date.</p>
            </div>
          ) : (
            <div className="reflection-placeholder">
              <p>Select a date from the calendar to view your reflection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default MyReflections;
