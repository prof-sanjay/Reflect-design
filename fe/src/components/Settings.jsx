import React, { useState, useEffect } from 'react';
import '../styles/Settings.css';

const Settings = ({ onClose, theme, setTheme }) => {
  const [localTheme, setLocalTheme] = useState(theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', localTheme);
  }, [localTheme]);

  const handleThemeChange = (selectedTheme) => {
    setLocalTheme(selectedTheme);
    setTheme(selectedTheme);
    localStorage.setItem('theme', selectedTheme);
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="settings-content">
          <div className="setting-group">
            <h3>Appearance</h3>
            <div className="theme-options">
              <div 
                className={`theme-option ${localTheme === 'light' ? 'selected' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <div className="theme-preview light-preview">
                  <div className="preview-header"></div>
                  <div className="preview-content"></div>
                </div>
                <span>Light Mode</span>
              </div>
              
              <div 
                className={`theme-option ${localTheme === 'dark' ? 'selected' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <div className="theme-preview dark-preview">
                  <div className="preview-header"></div>
                  <div className="preview-content"></div>
                </div>
                <span>Dark Mode</span>
              </div>
            </div>
          </div>
          
          <div className="setting-group">
            <h3>About</h3>
            <div className="about-content">
              <p>Reflect - Your Personal Wellness Tracker</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;