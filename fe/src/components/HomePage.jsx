import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import "./HomePage.css";

function HomePage() {
  const [username, setUsername] = useState("User");

  // Fetch profile name from backend
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
          if (data && data.name) {
            setUsername(data.name);
          }
        }
      } catch (error) {
        console.log("Profile fetch error:", error);
      }
    };

    fetchProfileName();
  }, []);

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Section */}
      <header className="home-hero">
        <h1 className="hero-title">Welcome back, {username} 🌿</h1>
        <p className="hero-subtitle">
          Reflect, grow, and rediscover yourself — one entry at a time.
        </p>
      </header>

      {/* Section Grid */}
      <main className="home-sections">
        {/* New Reflection */}
        <section className="section-card new-entry">
          <h2>📝 Start a New Reflection</h2>
          <p>Capture today’s thoughts and emotions in your journal.</p>
          <Link to="/new-reflection" className="action-btn">
            Start Writing
          </Link>
        </section>

        {/* Search Reflections */}
        <section className="section-card past-entries">
          <h2>📖 Search Reflections</h2>
          <p>Look back at your past reflections and see your journey unfold.</p>
          <Link to="/viewreport" className="action-btn">
            Search
          </Link>
        </section>

        {/* Reports */}
        <section className="section-card reports">
          <h2>📊 Mental Health Insights</h2>
          <p>Understand your emotional patterns and track your mental growth.</p>
          <button className="action-btn">View Reports</button>
        </section>

        {/* Personal Wellness */}
        <section className="section-card wellness">
          <h2>🌸 Personal Wellness</h2>
          <p>Check in with your habits, routines, and overall well-being.</p>
          <Link to="/personal-wellness" className="action-btn">
            Open Form
          </Link>
        </section>
      </main>
    </div>
  );
}

export default HomePage;
