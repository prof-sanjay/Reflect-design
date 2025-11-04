import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

// ✅ Environment-safe API URL
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const LoginPage = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Reset input fields
  const resetFields = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  // ✅ Toggle between Login and Signup
  const handleToggle = (toSignup) => {
    setIsSignup(toSignup);
    resetFields();
  };

  // ✅ Handle User Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !password)
      return alert("Please fill all required fields!");
    if (password !== confirmPassword)
      return alert("Passwords do not match!");

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/users/signup`, { username, password });
      alert("Signup successful! Please login.");
      handleToggle(false);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Signup failed. Try using a different username."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle User Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password)
      return alert("Please enter both username and password.");

    try {
      setLoading(true);
      const { data } = await axios.post(`${API_BASE}/users/login`, {
        username,
        password,
      });

      // ✅ Save user data and token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Set default header for future axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      if (onLogin) onLogin(data.user);

      alert("Login successful!");
      navigate("/home");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        {/* 🌈 Left Section */}
        <div className="login-left">
          <div className="brand-name">REFLECT</div>
          <div className="welcome-section">
            <h1>Welcome to Reflect</h1>
            <p>“Your thoughts shape your tomorrow. Reflect today.”</p>
          </div>
        </div>

        {/* 🔐 Right Section (Form) */}
        <div className="login-right">
          <div className="login-box">
            <h2>{isSignup ? "Sign Up" : "Login"}</h2>
            <p className="login-subtitle">
              {isSignup
                ? "Create an account to start your journey."
                : "Welcome back! Login to track your progress."}
            </p>

            <form onSubmit={isSignup ? handleSignup : handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {isSignup && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : isSignup
                  ? "SIGN UP"
                  : "LOGIN"}
              </button>
            </form>

            <div className="links">
              <p>
                {isSignup ? "Already have an account?" : "New User?"}{" "}
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => handleToggle(!isSignup)}
                >
                  {isSignup ? "Login" : "Signup"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
