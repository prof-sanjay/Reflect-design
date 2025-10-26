import React, { Component } from "react";
import "./Calendar.css";

class Calendar extends Component {
  state = {
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
  };

  getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  getMoodColor = (mood) => {
    const moodColors = {
      happy: "#4ade80",
      sad: "#60a5fa",
      angry: "#f87171",
      anxious: "#fbbf24",
      calm: "#a78bfa",
      excited: "#fb923c",
      neutral: "#94a3b8",
    };
    return moodColors[mood] || "#e5e7eb";
  };

  getDateKey = (day) => {
    const { currentMonth, currentYear } = this.state;
    return `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  handlePrevMonth = () => {
    this.setState((prev) => {
      if (prev.currentMonth === 0) {
        return { currentMonth: 11, currentYear: prev.currentYear - 1 };
      }
      return { currentMonth: prev.currentMonth - 1 };
    });
  };

  handleNextMonth = () => {
    this.setState((prev) => {
      if (prev.currentMonth === 11) {
        return { currentMonth: 0, currentYear: prev.currentYear + 1 };
      }
      return { currentMonth: prev.currentMonth + 1 };
    });
  };

  render() {
    const { currentMonth, currentYear } = this.state;
    const { moodData, onDateSelect, selectedDate } = this.props;
    const daysInMonth = this.getDaysInMonth(currentMonth, currentYear);
    const firstDay = this.getFirstDayOfMonth(currentMonth, currentYear);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = this.getDateKey(day);
      const mood = moodData[dateKey];
      const isSelected = selectedDate === dateKey;
      const isToday = dateKey === new Date().toISOString().split('T')[0];

      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          style={{
            backgroundColor: mood ? this.getMoodColor(mood) : 'transparent',
            color: mood ? '#fff' : '#333',
            fontWeight: mood ? 'bold' : 'normal',
          }}
          onClick={() => onDateSelect(dateKey)}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={this.handlePrevMonth} className="calendar-nav">
            ← Previous
          </button>
          <h3 className="calendar-month-year">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button onClick={this.handleNextMonth} className="calendar-nav">
            Next →
          </button>
        </div>
        
        <div className="calendar-weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        
        <div className="calendar-grid">{days}</div>
        
        <div className="mood-legend">
          <span className="legend-item">
            <span className="mood-dot" style={{backgroundColor: '#4ade80'}}></span>
            Happy
          </span>
          <span className="legend-item">
            <span className="mood-dot" style={{backgroundColor: '#60a5fa'}}></span>
            Sad
          </span>
          <span className="legend-item">
            <span className="mood-dot" style={{backgroundColor: '#f87171'}}></span>
            Angry
          </span>
          <span className="legend-item">
            <span className="mood-dot" style={{backgroundColor: '#fbbf24'}}></span>
            Anxious
          </span>
          <span className="legend-item">
            <span className="mood-dot" style={{backgroundColor: '#a78bfa'}}></span>
            Calm
          </span>
          <span className="legend-item">
            <span className="mood-dot" style={{backgroundColor: '#fb923c'}}></span>
            Excited
          </span>
        </div>
      </div>
    );
  }
}

export default Calendar;