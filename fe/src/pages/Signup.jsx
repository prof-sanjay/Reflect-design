import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Signup.css";

const Signup = () => {
  const [userType, setUserType] = useState("user"); // user or therapist
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [therapistData, setTherapistData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    specialization: "",
    experience: "",
    bio: "",
    pricePerSession: "",
    availability: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTherapistInputChange = (e) => {
    setTherapistData({ ...therapistData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!formData.username || !formData.password || !formData.email) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (userType === "therapist") {
      if (!therapistData.firstName || !therapistData.lastName || !therapistData.specialization) {
        setError("Please fill in all required therapist fields");
        return;
      }
    }

    setLoading(true);
    
    try {
      // Prepare data for submission
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: userType
      };
      
      // Register user
      const response = await axios.post("http://localhost:5003/api/users/signup", userData);
      
      if (response.data.user) {
        // If therapist, also create therapist profile
        if (userType === "therapist") {
          const token = response.data.token || localStorage.getItem("token");
          const therapistProfileData = {
            ...therapistData,
            pricePerSession: parseFloat(therapistData.pricePerSession) || 50
          };
          
          await axios.post("http://localhost:5003/api/therapist/profile", therapistProfileData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        
        // Login automatically after signup
        const loginResponse = await axios.post("http://localhost:5003/api/users/login", {
          username: formData.username,
          password: formData.password
        });
        
        localStorage.setItem("token", loginResponse.data.token);
        localStorage.setItem("user", JSON.stringify(loginResponse.data.user));
        
        // Redirect based on role
        if (userType === "therapist") {
          navigate("/therapist/profile");
        } else {
          navigate("/habits");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Sign Up</h1>
          <h2>Create Your Account</h2>
          <p>Join our mental wellness community today</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="user-type-toggle">
          <button 
            className={`toggle-btn ${userType === "user" ? "active" : ""}`}
            onClick={() => setUserType("user")}
          >
            User Account
          </button>
          <button 
            className={`toggle-btn ${userType === "therapist" ? "active" : ""}`}
            onClick={() => setUserType("therapist")}
          >
            Therapist Account
          </button>
        </div>
        
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Account Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          
          {userType === "therapist" && (
            <div className="form-section">
              <h3>Therapist Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={therapistData.firstName}
                    onChange={handleTherapistInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={therapistData.lastName}
                    onChange={handleTherapistInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={therapistData.phone}
                    onChange={handleTherapistInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={therapistData.address}
                    onChange={handleTherapistInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="specialization">Specialization *</label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={therapistData.specialization}
                    onChange={handleTherapistInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="experience">Years of Experience</label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    value={therapistData.experience}
                    onChange={handleTherapistInputChange}
                    min="0"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label htmlFor="bio">Bio/Description</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={therapistData.bio}
                    onChange={handleTherapistInputChange}
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="pricePerSession">Price per Session ($)</label>
                  <input
                    type="number"
                    id="pricePerSession"
                    name="pricePerSession"
                    value={therapistData.pricePerSession}
                    onChange={handleTherapistInputChange}
                    min="0"
                    step="5"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="availability">Availability</label>
                  <input
                    type="text"
                    id="availability"
                    name="availability"
                    value={therapistData.availability}
                    onChange={handleTherapistInputChange}
                    placeholder="e.g., Mon-Fri 9am-5pm"
                  />
                </div>
              </div>
            </div>
          )}
          
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
          
          <div className="login-link">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;