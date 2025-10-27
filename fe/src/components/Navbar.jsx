import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css'; 
// Note: This component assumes it is rendered inside <Router>

const Navbar = ({ username = 'User', onLogout }) => {
  return (
    <nav className="navbar">
      {/* Left Side: Logo/Brand */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Reflect
        </Link>
      </div>

      {/* Right Side: Navigation Links */}
      <div className="navbar-right">
        <NavLink to="/home" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
          Home
        </NavLink>
        <NavLink to="/my-reflections" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Reflections
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Profile
        </NavLink>
        <Link to="/login" className="nav-item logout">Logout</Link>

      </div>
    </nav>
  );
};

export default Navbar;