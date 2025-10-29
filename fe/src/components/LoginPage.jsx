import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Add this
import "./LoginPage.css";

const LoginPage = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate(); // ✅ Create navigate instance

  const resetFields = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleToggle = (shouldSignup) => {
    setIsSignup(shouldSignup);
    resetFields();
  };

  // ✅ Handle Login
  const handleLogin = (e) => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem("reflectUser"));

    if (!savedUser) {
      alert("No user found. Please sign up first!");
      return;
    }

    if (savedUser.username === username && savedUser.password === password) {
      if (onLogin) onLogin(savedUser);
      navigate("/home"); // ✅ Redirect to Home page
    } else {
      alert("Invalid username or password!");
    }
  };

  // ✅ Handle Signup
  const handleSignup = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill all fields!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const newUser = { username, password };
    localStorage.setItem("reflectUser", JSON.stringify(newUser));
    handleToggle(false);
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        {/* Left Section */}
        <div className="login-left">
          <div className="brand-name">REFLECT</div>
          <div className="welcome-section">
            <h1>Welcome to Reflect</h1>
            <p>“Your thoughts shape your tomorrow. Reflect today.”</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="login-right">
          <div className="login-box">
            <h2>{isSignup ? "Sign Up" : "Login"}</h2>
            <p className="login-subtitle">
              {isSignup
                ? "Create an account to start your journey."
                : "Welcome back! Login to track your mental health."}
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
