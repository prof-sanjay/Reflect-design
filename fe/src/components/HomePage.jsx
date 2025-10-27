import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import Navbar from './Navbar.jsx';
import MyReflections from './MyReflections.jsx';

function HomePage() {
  const staticUsername = 'User'; 

  return (
    <div className="home-page">
      <Navbar />

      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome back, {staticUsername} 🌿</h1>
          <p className="hero-subtitle">
            Reflect, grow, and rediscover yourself — one entry at a time.
          </p>
        </div>
      </div>

      <div className="home-sections">
        <div className="section-card new-entry">
          <h2>📝 Start a New Reflection</h2>
          <p>Capture today’s thoughts and emotions in your journal.</p>
          <button className="action-btn">Start Writing</button>
        </div>

        <div className="section-card past-entries">
          <h2>📖 Review Past Entries</h2>
          <p>Look back at your past reflections and see your journey unfold.</p>
          <button className="action-btn">View Reflections</button>
        </div>

        <div className="section-card reports">
          <h2>📊 Generate Insights</h2>
          <p>Understand your emotional patterns and track your growth.</p>
          <button className="action-btn">View Reports</button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;