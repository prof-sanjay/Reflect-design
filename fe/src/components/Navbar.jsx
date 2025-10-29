import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import Settings from "./Settings.jsx";
import TodoList from "./TodoList.jsx";


const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      {/* --- Top bar --- */}
      <header className="topbar">
        <div className="hamburger" onClick={toggleMobile}>
          <div className={`bar ${isMobileOpen ? "open" : ""}`} />
          <div className={`bar ${isMobileOpen ? "open" : ""}`} />
          <div className={`bar ${isMobileOpen ? "open" : ""}`} />
        </div>

        <Link to="/reflect" className="navbar-logo">
          Reflect
        </Link>
      </header>

      {/* --- Sidebar --- */}
      <aside
        className={`sidebar ${isExpanded ? "expanded" : ""} ${
          isMobileOpen ? "mobile-open" : ""
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <nav className="nav-links">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeMobile}
            end
          >
            <span className="icon">🏠</span>
            <span className="label">Home</span>
          </NavLink>

          <NavLink
            to="/my-reflections"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeMobile}
          >
            <span className="icon">🪞</span>
            <span className="label">Reflections</span>
          </NavLink>

          <NavLink
             to="/To-do-list"
             className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
             }
             onClick={closeMobile}
          >
            <span className="icon">✅</span>
            <span className="label">To-Do List</span>
          </NavLink>

          <NavLink
              to="/goals"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={closeMobile}
            >
              <span className="icon">🎯</span>
              <span className="label">Goals</span>
          </NavLink>



        </nav>

        {/* --- Bottom Links --- */}
        <div className="bottom-links">
           <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeMobile}
          >
            <span className="icon">👤</span>
            <span className="label">Profile</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeMobile}
          >
            <span className="icon">⚙️</span>
            <span className="label">Settings</span>
          </NavLink>

          <Link to="/" className="nav-link logout" onClick={closeMobile}>
            <span className="icon">🚪</span>
            <span className="label">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && <div className="overlay" onClick={closeMobile}></div>}
    </>
  );
};

export default Navbar;
