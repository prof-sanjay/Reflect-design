// fe/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

// 🔥 Added import
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔥 Added context login function
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Backend URL
      const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5003";

      const response = await axios.post(
        `${BACKEND_URL}/api/users/login`,
        { username, password }
      );

      const { token, user } = response.data;

      // 🔥 Use AuthContext to update user instantly
      await login({
        token,
        user,
      });

      // ROLE-BASED REDIRECTION
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "therapist") {
        navigate("/therapist/profile");
      } else {
        navigate("/dashboard");   
      }

    } catch (err) {
      console.error("Login error:", err);

      if (err.code === "ERR_NETWORK" || !err.response) {
        setError("Cannot connect to backend. Please ensure it is running.");
      } else {
        setError(err.response?.data?.message || "Login failed.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <video autoPlay muted loop className="background-video">
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      <div className="video-overlay"></div>

      <div className="login-card">
        <div className="login-header">
          <h1>📖 REFLECT</h1>
          <p className="tagline">A Daily Journaling App</p>
          <p className="welcome">Welcome back! Please login to continue</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
