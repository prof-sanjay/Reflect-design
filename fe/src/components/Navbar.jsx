// fe/src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Navbar.css";

const Navbar = ({ onFeedbackClick, onSettingsClick }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole"); // 🔥 Detect user role

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* Logo */}
        <Link to="/dashboard" className="nav-logo">
          Reflect
        </Link>

        {/* If logged in → show menu */}
        {currentUser && (
          <ul className="nav-menu">

            {/* NORMAL USER MENU */}
            {userRole === "user" && (
              <>
                <li className="nav-item"><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
                <li className="nav-item"><Link to="/wellness" className="nav-link">Wellness</Link></li>
                <li className="nav-item"><Link to="/reflection" className="nav-link">Reflection</Link></li>
                <li className="nav-item"><Link to="/goals" className="nav-link">Goals</Link></li>
                <li className="nav-item"><Link to="/therapist-booking" className="nav-link">Book Therapist</Link></li>
                <li className="nav-item"><Link to="/analytics" className="nav-link">Analytics</Link></li>
                <li className="nav-item"><Link to="/profile" className="nav-link">Profile</Link></li>
              </>
            )}

            {/* THERAPIST MENU */}
            {userRole === "therapist" && (
              <>
                <li className="nav-item"><Link to="/therapist/dashboard" className="nav-link">Dashboard</Link></li>
                <li className="nav-item"><Link to="/therapist/patients" className="nav-link">Patients</Link></li>
                <li className="nav-item"><Link to="/therapist/alerts" className="nav-link">Alerts</Link></li>
                <li className="nav-item"><Link to="/therapist/appointments" className="nav-link">Appointments</Link></li>
                <li className="nav-item"><Link to="/therapist/profile" className="nav-link">Profile</Link></li>
              </>
            )}

            {/* ADMIN MENU */}
            {userRole === "admin" && (
              <>
                <li className="nav-item"><Link to="/admin" className="nav-link">Admin Dashboard</Link></li>
                <li className="nav-item"><Link to="/admin/users" className="nav-link">Users</Link></li>
                <li className="nav-item"><Link to="/admin/therapists" className="nav-link">Therapists</Link></li>
                <li className="nav-item"><Link to="/admin/analytics" className="nav-link">Analytics</Link></li>
              </>
            )}

          </ul>
        )}

        {/* Buttons */}
        <div className="nav-buttons">
          {currentUser && (
            <>
              <button className="feedback-btn" onClick={onFeedbackClick}>Feedback</button>
              <button className="settings-btn" onClick={onSettingsClick}>Settings</button>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
