import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Navbar from './Navbar.jsx';

function HomePage() {
  const staticUsername = 'User'; 

  return (
    <div className="home-page">

      <header className="navbar">
        {/* <div className="logo">Reflect</div>
        <nav className="nav-links">
          <Link to="/home" className="nav-item">Home</Link>
          <Link to="/my-reflections" className="nav-item">My Reflections</Link>
          <Link to="/profile" className="nav-item">Profile</Link>
          <Link to="/logout" className="nav-item logout">Logout</Link>
        </nav> */}
        <Navbar/>
      </header>

      {/* Page Content */}
      <div className="home-content">
        <h1 className="welcome-message">
          Hello, {staticUsername}! Welcome
        </h1>

        <div className="dashboard-grid">
          {/* Quick Action Card: New Entry */}
          <div className="action-card new-entry">
            <h2>Start a New Reflection</h2>
            <p>What's on your mind today? Let's record your thoughts.</p>
          </div>

          {/* Quick View Card: Past Entries */}
          <div className="action-card past-entries">
            <h2>Review Past Entries</h2>
            <p>Look back at your journey and see how far you've come.</p>
          </div>

          {/* Quick Action Card: Reports */}
          <div className="action-card reports">
            <h2>Generate Insights</h2>
            <p>See patterns, moods, and trends over time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
