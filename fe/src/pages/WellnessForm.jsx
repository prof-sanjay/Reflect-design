import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveWellnessData, getWellnessHistory } from "../utils/api"; // Import API functions
import "../styles/WellnessForm.css";

const WellnessForm = () => {
  const navigate = useNavigate();
  
  // Form data state with localStorage persistence
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('wellnessFormData');
    return savedData ? JSON.parse(savedData) : {
      // Sleep data
      sleepTime: "",
      wakeTime: "",
      totalSleepHours: "",
      deepSleep: "",
      lightSleep: "",
      
      // Activity data
      steps: "",
      mood: "",
      hydration: "",
      
      // Meals
      meals: "",
      
      // Exercise
      exerciseType: "",
      exerciseDuration: "",
      
      // Meditation
      meditationDuration: ""
    };
  });
  
  // User data entries for charts
  const [userEntries, setUserEntries] = useState(() => {
    const savedEntries = localStorage.getItem('wellnessUserEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });
  
  // Habit tracker state with localStorage persistence
  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem('wellnessHabits');
    return savedHabits ? JSON.parse(savedHabits) : [
      { id: 1, name: "Drink Water", completed: false, icon: "💧" },
      { id: 2, name: "Exercise", completed: false, icon: "🏃" },
      { id: 3, name: "Meditation", completed: false, icon: "🧘" },
      { id: 4, name: "Healthy Meal", completed: false, icon: "🥗" },
      { id: 5, name: "No Junk Food", completed: false, icon: "🚫" },
      { id: 6, name: "Early Sleep", completed: false, icon: "😴" }
    ];
  });
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Loading and validation states
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Smart recommendations
  const [recommendations] = useState([
    {
      id: 1,
      title: "Hydration Boost",
      message: "You're doing great with water intake! Try adding lemon for extra flavor and benefits.",
      icon: "🍋"
    },
    {
      id: 2,
      title: "Mindful Moment",
      message: "Take 5 minutes to practice deep breathing. It can help reduce stress and improve focus.",
      icon: "💨"
    },
    {
      id: 3,
      title: "Sleep Optimization",
      message: "Try turning off screens 30 minutes before bedtime for better sleep quality.",
      icon: "🌙"
    }
  ]);
  
  // Mood options
  const moodOptions = [
    { id: "happy", emoji: "😊", label: "Happy" },
    { id: "excited", emoji: "🤩", label: "Excited" },
    { id: "calm", emoji: "😌", label: "Calm" },
    { id: "neutral", emoji: "😐", label: "Neutral" },
    { id: "tired", emoji: "😴", label: "Tired" },
    { id: "stressed", emoji: "😰", label: "Stressed" },
    { id: "sad", emoji: "😢", label: "Sad" }
  ];
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wellnessFormData', JSON.stringify(formData));
  }, [formData]);
  
  useEffect(() => {
    localStorage.setItem('wellnessHabits', JSON.stringify(habits));
  }, [habits]);
  
  useEffect(() => {
    localStorage.setItem('wellnessUserEntries', JSON.stringify(userEntries));
  }, [userEntries]);
  
  // Load wellness data from database on component mount
  useEffect(() => {
    loadWellnessData();
  }, []);
  
  // Effect to load data when a date is selected
  useEffect(() => {
    if (selectedDate) {
      loadEntryForDate(selectedDate);
    }
  }, [selectedDate]);
  
  // Load wellness data from database
  const loadWellnessData = async () => {
    try {
      setLoading(true);
      const data = await getWellnessHistory(7); // Get only last 7 days
      
      // Transform the data to match our format
      const transformedData = data.map(entry => ({
        ...entry,
        date: new Date(entry.date).toISOString().split('T')[0],
        totalSleepHours: entry.sleepHours || 0,
        // Map other fields as needed
      })).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending
      
      setUserEntries(transformedData);
      localStorage.setItem('wellnessUserEntries', JSON.stringify(transformedData));
    } catch (error) {
      console.error("Failed to load wellness data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Load entry for a specific date
  const loadEntryForDate = async (date) => {
    try {
      // Find entry in existing userEntries
      const entry = userEntries.find(e => e.date === date);
      
      if (entry) {
        // Load existing entry data into form
        setFormData({
          sleepTime: entry.sleepTime || "",
          wakeTime: entry.wakeTime || "",
          totalSleepHours: entry.totalSleepHours || entry.sleepHours || "",
          deepSleep: entry.deepSleep || "",
          lightSleep: entry.lightSleep || "",
          steps: entry.steps || "",
          mood: entry.mood || "",
          hydration: entry.hydration || "",
          meals: entry.meals || "",
          exerciseType: entry.exerciseType || "",
          exerciseDuration: entry.exerciseDuration || "",
          meditationDuration: entry.meditationDuration || ""
        });
      } else {
        // Clear form if no entry for this date
        setFormData({
          sleepTime: "",
          wakeTime: "",
          totalSleepHours: "",
          deepSleep: "",
          lightSleep: "",
          steps: "",
          mood: "",
          hydration: "",
          meals: "",
          exerciseType: "",
          exerciseDuration: "",
          meditationDuration: ""
        });
      }
    } catch (error) {
      console.error("Failed to load entry for date:", error);
    }
  };
  
  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Validate sleep time and wake time
    if (!formData.sleepTime) {
      newErrors.sleepTime = "Sleep time is required";
    }
    
    if (!formData.wakeTime) {
      newErrors.wakeTime = "Wake time is required";
    }
    
    // Validate sleep hours
    if (!formData.totalSleepHours) {
      newErrors.totalSleepHours = "Total sleep hours is required";
    } else if (isNaN(formData.totalSleepHours) || parseFloat(formData.totalSleepHours) <= 0) {
      newErrors.totalSleepHours = "Total sleep hours must be a positive number";
    } else if (parseFloat(formData.totalSleepHours) > 24) {
      newErrors.totalSleepHours = "Total sleep hours cannot exceed 24 hours";
    }
    
    // Validate deep sleep and light sleep
    if (formData.deepSleep && (isNaN(formData.deepSleep) || parseFloat(formData.deepSleep) < 0)) {
      newErrors.deepSleep = "Deep sleep must be a positive number";
    }
    
    if (formData.lightSleep && (isNaN(formData.lightSleep) || parseFloat(formData.lightSleep) < 0)) {
      newErrors.lightSleep = "Light sleep must be a positive number";
    }
    
    // Validate that deep sleep + light sleep doesn't exceed total sleep
    if (formData.deepSleep && formData.lightSleep && formData.totalSleepHours) {
      const deep = parseFloat(formData.deepSleep);
      const light = parseFloat(formData.lightSleep);
      const total = parseFloat(formData.totalSleepHours);
      
      if (deep + light > total) {
        newErrors.sleepConsistency = "Deep sleep and light sleep combined cannot exceed total sleep hours";
      }
    }
    
    // Validate steps
    if (formData.steps && (isNaN(formData.steps) || parseInt(formData.steps) < 0)) {
      newErrors.steps = "Steps must be a positive number";
    }
    
    // Validate hydration
    if (formData.hydration && (isNaN(formData.hydration) || parseInt(formData.hydration) < 0)) {
      newErrors.hydration = "Hydration must be a positive number";
    }
    
    // Validate mood
    if (!formData.mood) {
      newErrors.mood = "Please select your mood";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Toggle habit completion
  const toggleHabit = (id) => {
    const updatedHabits = habits.map(habit => 
      habit.id === id 
        ? { ...habit, completed: !habit.completed } 
        : habit
    );
    setHabits(updatedHabits);
  };
  
  // Handle mood selection
  const handleMoodSelect = (moodId) => {
    setFormData({
      ...formData,
      mood: moodId
    });
    
    // Clear mood error when user selects a mood
    if (errors.mood) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.mood;
        return newErrors;
      });
    }
  };
  
  // Calculate wellness score based on completed habits and data
  const calculateWellnessScore = () => {
    const completedHabitsCount = habits.filter(habit => habit.completed).length;
    const habitScore = (completedHabitsCount / habits.length) * 40;
    
    let dataScore = 0;
    const dataFields = [
      formData.sleepTime, 
      formData.wakeTime, 
      formData.totalSleepHours, 
      formData.deepSleep, 
      formData.lightSleep,
      formData.steps,
      formData.mood,
      formData.hydration,
      formData.meals,
      formData.exerciseType,
      formData.exerciseDuration,
      formData.meditationDuration
    ];
    
    // Convert all fields to strings before checking
    const filledFields = dataFields.filter(field => {
      const fieldValue = field !== null && field !== undefined ? String(field) : '';
      return fieldValue.trim() !== '';
    }).length;
    
    dataScore = (filledFields / dataFields.length) * 60;
    
    return Math.round(habitScore + dataScore);
  };
  
  // Calculate circular progress
  const calculateProgress = (value, max = 10) => {
    if (!value || isNaN(value)) return 0;
    const numValue = parseFloat(value);
    if (numValue <= 0) return 0;
    return Math.min((numValue / max) * 100, 100); // Cap at 100%
  };
  
  // Render circular progress
  const renderCircularProgress = (value, max = 10, label, color = "#4ade80") => {
    const progress = calculateProgress(value, max);
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    // Ensure strokeDashoffset is a valid number
    const validStrokeDashoffset = isNaN(strokeDashoffset) ? circumference : strokeDashoffset;
    
    return (
      <div className="metric-card">
        <div className="circular-progress-container">
          <svg className="circular-progress" width="100" height="100">
            <circle
              className="progress-background"
              cx="50"
              cy="50"
              r={radius}
              strokeWidth="8"
            />
            <circle
              className="progress-value"
              cx="50"
              cy="50"
              r={radius}
              strokeWidth="8"
              stroke={color}
              strokeDasharray={circumference}
              strokeDashoffset={validStrokeDashoffset}
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="progress-text">
            <span className="progress-value-text">{value || 0}</span>
            <span className="progress-max-text">/{max}</span>
          </div>
        </div>
        <div className="metric-label">{label}</div>
      </div>
    );
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare data for saving to database
      const wellnessData = {
        date: selectedDate, // Use the selected date from calendar
        sleepHours: parseFloat(formData.totalSleepHours) || 0,
        // Map other form fields to database fields as needed
        energyLevel: 5, // Default value, you can add form fields for these
        stressLevel: 5,
        mood: formData.mood || "neutral",
        mentalHealth: "good",
        notes: "",
        // Add other fields as needed
        sleepTime: formData.sleepTime,
        wakeTime: formData.wakeTime,
        deepSleep: parseFloat(formData.deepSleep) || 0,
        lightSleep: parseFloat(formData.lightSleep) || 0,
        steps: parseInt(formData.steps) || 0,
        hydration: parseInt(formData.hydration) || 0,
        meals: formData.meals,
        exerciseType: formData.exerciseType,
        exerciseDuration: parseInt(formData.exerciseDuration) || 0,
        meditationDuration: parseInt(formData.meditationDuration) || 0
      };
      
      // Save to database
      const savedEntry = await saveWellnessData(wellnessData);
      
      // Create a new entry for local state
      const newEntry = {
        ...savedEntry,
        date: new Date(savedEntry.date).toISOString().split('T')[0],
        totalSleepHours: savedEntry.sleepHours || 0,
        // Map other fields as needed
      };
      
      // Update user entries
      let updatedEntries = [...userEntries];
      const existingIndex = updatedEntries.findIndex(e => e.date === newEntry.date);
      
      if (existingIndex >= 0) {
        // Update existing entry
        updatedEntries[existingIndex] = newEntry;
      } else {
        // Add new entry
        updatedEntries = [...updatedEntries, newEntry];
      }
      
      // Sort entries by date
      updatedEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Keep only last 7 days
      if (updatedEntries.length > 7) {
        updatedEntries = updatedEntries.slice(-7);
      }
      
      setUserEntries(updatedEntries);
      
      // Save to localStorage
      localStorage.setItem('wellnessUserEntries', JSON.stringify(updatedEntries));
      
      // Show success message
      alert(`Wellness data saved successfully for ${selectedDate}!`);
    } catch (error) {
      console.error("Failed to save wellness data:", error);
      // Handle specific error cases
      if (error.response && error.response.status === 400) {
        if (error.response.data && error.response.data.message) {
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert("Wellness entry already exists for this date. Please try updating the existing entry.");
        }
      } else {
        alert("Failed to save wellness data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Calendar functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };
  
  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasEntry = userEntries.some(entry => entry.date === dateStr);
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${dateStr === selectedDate ? 'selected' : ''} ${hasEntry ? 'has-entry' : ''}`}
          onClick={() => setSelectedDate(dateStr)}
        >
          {day}
          {hasEntry && <div className="entry-indicator"></div>}
        </div>
      );
    }
    
    return days;
  };
  
  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };
  
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  
  // Get entry for selected date
  const getEntryForDate = (date) => {
    return userEntries.find(entry => entry.date === date);
  };
  
  // Generate sleep data for chart from database entries (last 7 days)
  const generateSleepChartData = () => {
    // Use the userEntries which now contains only the last 7 days of data
    if (userEntries.length === 0) {
      // If no entries, generate random data for visualization
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const data = [];
      
      // Generate data for the past 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Generate random sleep data
        const totalSleep = (Math.random() * 6 + 4).toFixed(1); // 4-10 hours
        const deepSleep = (Math.random() * 3 + 1).toFixed(1); // 1-4 hours
        const lightSleep = (totalSleep - deepSleep).toFixed(1);
        
        data.push({
          date: days[date.getDay()],
          total: parseFloat(totalSleep),
          deep: parseFloat(deepSleep),
          light: parseFloat(lightSleep)
        });
      }
      
      return data;
    }
    
    return userEntries.map(entry => {
      // Extract sleep data from entry
      const totalSleep = entry.totalSleepHours || entry.sleepHours || 0;
      
      // For demo purposes, we'll derive deep and light sleep from total
      // In a real app, you'd have separate fields for these
      const deepSleep = (totalSleep * 0.3).toFixed(1); // 30% deep sleep
      const lightSleep = (totalSleep * 0.7).toFixed(1); // 70% light sleep
      
      return {
        date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
        total: parseFloat(totalSleep),
        deep: parseFloat(deepSleep),
        light: parseFloat(lightSleep)
      };
    });
  };
  
  const wellnessScore = calculateWellnessScore();
  const selectedEntry = getEntryForDate(selectedDate);
  const sleepChartData = generateSleepChartData();
  
  return (
    <div className="wellness-hub">
      {/* Header */}
      <div className="wellness-header">
        <div className="header-content">
          <h1>My Wellness Hub</h1>
          <p>Track your wellness journey by entering your daily data below</p>
        </div>
      </div>
      
      <div className="wellness-content">
        {/* Calendar Section - Moved to top and made smaller */}
        <div className="wellness-section">
          <h2>📅 Wellness Calendar</h2>
          <div className="compact-calendar-container">
            <div className="calendar-header">
              <button className="nav-button" onClick={() => navigateMonth(-1)}>‹</button>
              <h4>{getMonthName(currentDate)}</h4>
              <button className="nav-button" onClick={() => navigateMonth(1)}>›</button>
            </div>
            <div className="compact-calendar-grid">
              <div className="calendar-day-name">S</div>
              <div className="calendar-day-name">M</div>
              <div className="calendar-day-name">T</div>
              <div className="calendar-day-name">W</div>
              <div className="calendar-day-name">T</div>
              <div className="calendar-day-name">F</div>
              <div className="calendar-day-name">S</div>
              {renderCalendar()}
            </div>
            <div className="calendar-legend">
              <div className="legend-item">
                <div className="legend-color has-entry"></div>
                <span>Entry</span>
              </div>
              <div className="legend-item">
                <div className="legend-color selected"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>
          
          {/* Selected Date Details */}
          {selectedEntry && (
            <div className="selected-date-details">
              <h4>Details for {selectedDate}</h4>
              <div className="date-details-grid">
                <div className="detail-card">
                  <h5>Sleep</h5>
                  <p>{selectedEntry.totalSleepHours || selectedEntry.sleepHours || 0} hours</p>
                </div>
                <div className="detail-card">
                  <h5>Mood</h5>
                  <p>{moodOptions.find(m => m.id === selectedEntry.mood)?.emoji || "😐"}</p>
                </div>
                <div className="detail-card">
                  <h5>Steps</h5>
                  <p>{selectedEntry.steps || 0}</p>
                </div>
                <div className="detail-card">
                  <h5>Water</h5>
                  <p>{selectedEntry.hydration || 0} glasses</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Data Entry Form */}
        <div className="wellness-section">
          <h2>📝 Daily Wellness Data</h2>
          <form className="wellness-data-form" onSubmit={handleSubmit}>
            {/* Sleep Section with Chart */}
            <div className="form-section">
              <h3>😴 Sleep Cycle</h3>
              <div className="sleep-section-container">
                <div className="sleep-form-grid">
                  <div className="form-group">
                    <label>Sleep Time *</label>
                    <input
                      type="time"
                      name="sleepTime"
                      value={formData.sleepTime}
                      onChange={handleInputChange}
                      className={`form-input ${errors.sleepTime ? 'error' : ''}`}
                    />
                    {errors.sleepTime && <span className="error-message">{errors.sleepTime}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Wake Time *</label>
                    <input
                      type="time"
                      name="wakeTime"
                      value={formData.wakeTime}
                      onChange={handleInputChange}
                      className={`form-input ${errors.wakeTime ? 'error' : ''}`}
                    />
                    {errors.wakeTime && <span className="error-message">{errors.wakeTime}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Total Sleep (hours) *</label>
                    <input
                      type="number"
                      name="totalSleepHours"
                      value={formData.totalSleepHours}
                      onChange={handleInputChange}
                      className={`form-input ${errors.totalSleepHours ? 'error' : ''}`}
                      min="0"
                      max="24"
                      step="0.5"
                      placeholder="e.g., 7.5"
                    />
                    {errors.totalSleepHours && <span className="error-message">{errors.totalSleepHours}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Deep Sleep (hours)</label>
                    <input
                      type="number"
                      name="deepSleep"
                      value={formData.deepSleep}
                      onChange={handleInputChange}
                      className={`form-input ${errors.deepSleep ? 'error' : ''}`}
                      min="0"
                      max="12"
                      step="0.5"
                      placeholder="e.g., 2.5"
                    />
                    {errors.deepSleep && <span className="error-message">{errors.deepSleep}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Light Sleep (hours)</label>
                    <input
                      type="number"
                      name="lightSleep"
                      value={formData.lightSleep}
                      onChange={handleInputChange}
                      className={`form-input ${errors.lightSleep ? 'error' : ''}`}
                      min="0"
                      max="12"
                      step="0.5"
                      placeholder="e.g., 5"
                    />
                    {errors.lightSleep && <span className="error-message">{errors.lightSleep}</span>}
                  </div>
                  
                  {errors.sleepConsistency && (
                    <div className="form-group full-width">
                      <span className="error-message">{errors.sleepConsistency}</span>
                    </div>
                  )}
                </div>
                
                {/* Sleep Trend Visualization */}
                <div className="sleep-trend-visualization compact">
                  <h4>Sleep Trend</h4>
                  <div className="line-chart-container compact">
                    {userEntries.length > 0 ? (
                      <div className="line-chart compact">
                        <div className="chart-area compact">
                          <svg className="line-graph compact" viewBox="0 0 200 60">
                            {userEntries.length > 1 && (
                              <polyline
                                fill="none"
                                stroke="#8b5cf6"
                                strokeWidth="1.5"
                                points={
                                  userEntries.map((entry, index) => {
                                    const x = (index / (userEntries.length - 1)) * 200;
                                    const y = 60 - Math.min((entry.totalSleepHours || entry.sleepHours || 0) * 5, 60);
                                    return `${x},${y}`;
                                  }).join(' ')
                                }
                              />
                            )}
                            
                            {/* Data points */}
                            {userEntries.map((entry, index) => {
                              const x = (index / (userEntries.length - 1)) * 200;
                              const y = 60 - Math.min((entry.totalSleepHours || entry.sleepHours || 0) * 5, 60);
                              return (
                                <circle
                                  key={index}
                                  cx={x}
                                  cy={y}
                                  r="2"
                                  fill="#8b5cf6"
                                  className="data-point"
                                />
                              );
                            })}
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="no-data-message compact">No data</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Activity Section */}
            <div className="form-section">
              <h3>🚶 Activity & Mood</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Steps</label>
                  <input
                    type="number"
                    name="steps"
                    value={formData.steps}
                    onChange={handleInputChange}
                    className={`form-input ${errors.steps ? 'error' : ''}`}
                    min="0"
                    placeholder="e.g., 8000"
                  />
                  {errors.steps && <span className="error-message">{errors.steps}</span>}
                </div>
                
                <div className="form-group full-width">
                  <label>Today's Mood *</label>
                  <div className="mood-selector-inline">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.id}
                        type="button"
                        className={`mood-option-inline ${formData.mood === mood.id ? 'selected' : ''} ${errors.mood ? 'error' : ''}`}
                        onClick={() => handleMoodSelect(mood.id)}
                      >
                        <span className="mood-emoji">{mood.emoji}</span>
                        <span className="mood-label">{mood.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.mood && <span className="error-message">{errors.mood}</span>}
                </div>
                
                <div className="form-group">
                  <label>Glasses of Water</label>
                  <input
                    type="number"
                    name="hydration"
                    value={formData.hydration}
                    onChange={handleInputChange}
                    className={`form-input ${errors.hydration ? 'error' : ''}`}
                    min="0"
                    max="20"
                    placeholder="e.g., 8"
                  />
                  {errors.hydration && <span className="error-message">{errors.hydration}</span>}
                </div>
              </div>
            </div>
            
            {/* Meals Section */}
            <div className="form-section">
              <h3>🍽️ Meals</h3>
              <div className="form-group full-width">
                <label>Meals Today (separate with commas)</label>
                <textarea
                  name="meals"
                  value={formData.meals}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="e.g., Oatmeal, Salad, Grilled chicken"
                  rows="2"
                />
              </div>
            </div>
            
            {/* Exercise Section */}
            <div className="form-section">
              <h3>💪 Exercise</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Exercise Type</label>
                  <input
                    type="text"
                    name="exerciseType"
                    value={formData.exerciseType}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="e.g., Running, Yoga"
                  />
                </div>
                
                <div className="form-group">
                  <label>Duration (minutes)</label>
                  <input
                    type="number"
                    name="exerciseDuration"
                    value={formData.exerciseDuration}
                    onChange={handleInputChange}
                    className="form-input"
                    min="0"
                    placeholder="e.g., 30"
                  />
                </div>
              </div>
            </div>
            
            {/* Meditation Section */}
            <div className="form-section">
              <h3>🧘 Meditation</h3>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  name="meditationDuration"
                  value={formData.meditationDuration}
                  onChange={handleInputChange}
                  className="form-input"
                  min="0"
                  placeholder="e.g., 15"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Saving..." : "Save Wellness Data"}
              </button>
            </div>
          </form>
        </div>
        
        {/* Habit Tracker */}
        <div className="wellness-section">
          <h2>✅ Habit Tracker</h2>
          <div className="habits-card">
            <div className="habits-grid">
              {habits.map((habit) => (
                <div 
                  key={habit.id}
                  className={`habit-item ${habit.completed ? 'completed' : ''}`}
                  onClick={() => toggleHabit(habit.id)}
                >
                  <div className="habit-icon">{habit.icon}</div>
                  <div className="habit-name">{habit.name}</div>
                  <div className={`habit-status ${habit.completed ? 'completed' : ''}`}>
                    {habit.completed ? '✓' : '○'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Smart Recommendations */}
        <div className="wellness-section">
          <h2>💡 Smart Recommendations</h2>
          <div className="recommendations-container">
            {recommendations.map((rec) => (
              <div key={rec.id} className="recommendation-card">
                <div className="rec-icon">{rec.icon}</div>
                <div className="rec-content">
                  <h3>{rec.title}</h3>
                  <p>{rec.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessForm;