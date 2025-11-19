import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: ""
  });

  /** =========================
   * Handle Input Change
   * =========================*/
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  /** =========================
   * Toggle Login / Signup
   * =========================*/
  const handleToggle = () => {
    setIsSignup((prev) => !prev);
    setForm({ username: "", password: "", confirmPassword: "" });
  };

  /** =========================
   * Signup Handler
   * =========================*/
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password)
      return alert("Please fill all fields");

    if (form.password !== form.confirmPassword)
      return alert("Passwords do not match");

    try {
      setLoading(true);

      await axios.post(`${API_BASE}/users/signup`, {
        username: form.username,
        password: form.password,
      });

      alert("Signup successful! Please login.");
      handleToggle();
    } finally {
      setLoading(false);
    }
  };

  /** =========================
   * Login Handler
   * =========================*/
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password)
      return;

    try {
      setLoading(true);

      const { data } = await axios.post(`${API_BASE}/users/login`, {
        username: form.username,
        password: form.password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      if (onLogin) onLogin(data.user);

      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">

      {/* ====== Background Video ====== */}
      <video autoPlay muted loop playsInline className="bg-video">
        <source src="/videos/bg.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="overlay"></div>

      {/* Brand Title */}
      <div className="brand-title">REFLECT</div>

      {/* ====== Login / Signup Card ====== */}
      <div className="login-card fade-in">

        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>

        <p className="subtitle">
          {isSignup
            ? "Start your Reflect journey today"
            : "Log in to continue"}
        </p>

        <form onSubmit={isSignup ? handleSignup : handleLogin}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {isSignup && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

          <button className="action-btn" type="submit" disabled={loading}>
            {loading
              ? "Processing..."
              : isSignup
              ? "Sign Up"
              : "Login"}
          </button>
        </form>

        <p className="toggle-text">
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <button onClick={handleToggle} className="toggle-btn">
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
