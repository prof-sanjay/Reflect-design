import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      {/* --- Top bar (mobile) --- */}
      <header className="topbar">
        <div className="hamburger" onClick={toggleMobile}>
          <div className={'bar ${isMobileOpen ? "open" : ""}'} />
          <div className={'bar ${isMobileOpen ? "open" : ""}'} />
          <div className={'bar ${isMobileOpen ? "open" : ""}'} />
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
             to="/TodoList"
             className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
             }
             onClick={closeMobile}
          >
            <span className="icon">✅</span>
            <span className="label">To-Do List</span>
           </NavLink>


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

          <Link to="/" className="nav-link logout" onClick={closeMobile}>
            <span className="icon">🚪</span>
            <span className="label">Logout</span>
          </Link>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && <div className="overlay" onClick={closeMobile}></div>}
    </>
  );
};

export default Navbar;