import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <div className="hamburger" onClick={toggleMobile}>
          <span className={`bar ${isMobileOpen ? "open" : ""}`}></span>
          <span className={`bar ${isMobileOpen ? "open" : ""}`}></span>
          <span className={`bar ${isMobileOpen ? "open" : ""}`}></span>
        </div>

        <Link to="/home" className="app-title">Reflect</Link>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`sidebar 
          ${isExpanded ? "expanded" : ""} 
          ${isMobileOpen ? "mobile-open" : ""}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* TOP NAV */}
        <nav className="nav-section">
          <NavLink to="/home" className="nav-item">
            <span className="icon">🏠</span>
            <span className="text">Home</span>
          </NavLink>

          <NavLink to="/my-reflections" className="nav-item">
            <span className="icon">🪞</span>
            <span className="text">Reflections</span>
          </NavLink>

          <NavLink to="/To-do-list" className="nav-item">
            <span className="icon">✅</span>
            <span className="text">To-Do List</span>
          </NavLink>

          <NavLink to="/goals" className="nav-item">
            <span className="icon">🎯</span>
            <span className="text">Goals</span>
          </NavLink>
        </nav>

        {/* BOTTOM NAV */}
        <nav className="nav-section bottom">
          <NavLink to="/profile" className="nav-item">
            <span className="icon">👤</span>
            <span className="text">Profile</span>
          </NavLink>

          <NavLink to="/settings" className="nav-item">
            <span className="icon">⚙️</span>
            <span className="text">Settings</span>
          </NavLink>

          <Link to="/" className="nav-item logout">
            <span className="icon">🚪</span>
            <span className="text">Logout</span>
          </Link>
        </nav>
      </aside>

      {/* MOBILE OVERLAY */}
      {isMobileOpen && <div className="overlay" onClick={toggleMobile}></div>}
    </>
  );
};

export default Navbar;
