import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import "./HomePage.css";

function HomePage() {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const fetchProfileName = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.name) setUsername(data.name);
        }
      } catch (err) {
        console.log("Profile fetch error:", err);
      }
    };

    fetchProfileName();
  }, []);

  return (
    <div className="homepage-wrapper">
      <Navbar />

      {/* ⭐⭐⭐ SCROLL AREA FIX ⭐⭐⭐ */}
      <div className="main-scroll-area">

        {/* HERO */}
        <header className="hero">
          <h1 className="hero-title">Welcome back, {username} 🌿</h1>
          <p className="hero-subtitle">
            Reflect, grow, and rediscover yourself — one entry at a time.
          </p>
        </header>

        {/* 2x2 GRID */}
        <main className="card-grid">

          <div className="glass-card new-card">
            <h2>📝 Start a New Reflection</h2>
            <p>Capture today’s thoughts and emotions in your journal.</p>
            <Link to="/my-reflections" className="card-btn">Start Writing</Link>
          </div>

          <div className="glass-card search-card">
            <h2>📖 Search Reflections</h2>
            <p>Look back at your past reflections and see your journey unfold.</p>
            <Link to="/viewreport" className="card-btn">Search</Link>
          </div>

          <div className="glass-card insights-card">
            <h2>📊 Mental Health Insights</h2>
            <p>Understand your emotional patterns and track your growth.</p>
            <Link to="/insights" className="card-btn">View Reports</Link>
          </div>

          <div className="glass-card wellness-card">
            <h2>🌸 Personal Wellness</h2>
            <p>Check in with your habits, routines, and overall well-being.</p>
            <Link to="/personal-wellness" className="card-btn">Open Form</Link>
          </div>

        </main>

      </div> {/* END SCROLL AREA */}

    </div>
  );
}

export default HomePage;
