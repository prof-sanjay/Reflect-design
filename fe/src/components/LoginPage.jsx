import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/users";

  const resetFields = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleToggle = (shouldSignup) => {
    setIsSignup(shouldSignup);
    resetFields();
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill all fields!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await axios.post(`${API_URL}/signup`, { username, password });
      alert("Signup successful! Please login.");
      handleToggle(false);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Signup failed. Try a different username."
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("userId", data._id);

      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      if (onLogin) onLogin(data);

      navigate("/home");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid login credentials.");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="login-left">
          <div className="brand-name">REFLECT</div>
          <div className="welcome-section">
            <h1>Welcome to Reflect</h1>
            <p>“Your thoughts shape your tomorrow. Reflect today.”</p>
          </div>
        </div>

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
                placeholder="User Name"
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

              <button type="submit" className="login-btn">
                {isSignup ? "SIGN UP" : "LOGIN"}
              </button>
            </form>

            <div className="links">
              <p>
                {isSignup ? "Already have an account?" : "New User?"}{" "}
                <button
                  className="toggle-btn"
                  type="button"
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
