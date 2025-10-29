import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import "./Settings.css";

const Settings = () => {
  const [theme, setTheme] = useState("light");

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    alert(`Theme changed to ${e.target.value} mode`);
  };

  const handleExport = () => {
    alert("Your journal data is being exported...");
    // Here you can add logic to export JSON or CSV later
  };

  return (
    <div className="settings-page">
      <Navbar />

      <div className="settings-container">
        <h2 className="settings-title">⚙️ Settings</h2>

        {/* --- Theme Section --- */}
        <div className="settings-section">
          <h3>Theme</h3>
          <p>Choose your preferred theme for the journal.</p>
          <select
            value={theme}
            onChange={handleThemeChange}
            className="theme-select"
          >
            <option value="light">🌞 Light Mode</option>
            <option value="dark">🌙 Dark Mode</option>
          </select>
        </div>

        {/* --- Export Data Section --- */}
        <div className="settings-section">
          <h3>Export Data</h3>
          <p>Download all your reflections and notes as a backup.</p>
          <button className="export-btn" onClick={handleExport}>
            ⬇️ Export Journal Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
