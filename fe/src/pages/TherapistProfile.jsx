import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/TherapistProfile.css";

const TherapistProfile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    specialization: "",
    experience: "",
    bio: "",
    pricePerSession: "",
    availability: "",
  });
  const [patients, setPatients] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // profile, patients
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
    loadPatients();
  }, []);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5003/api/therapist/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        setProfile({
          firstName: response.data.firstName || "",
          lastName: response.data.lastName || "",
          phone: response.data.phone || "",
          email: response.data.email || "",
          address: response.data.address || "",
          specialization: response.data.specialization || "",
          experience: response.data.experience || "",
          bio: response.data.bio || "",
          pricePerSession: response.data.pricePerSession || "",
          availability: response.data.availability || "",
        });
      }
    } catch (error) {
      console.error("Load profile error:", error);
      if (error.response?.status === 404) {
        setMessage("Please complete your profile");
      } else {
        setMessage("Failed to load profile");
      }
    }
  };

  const loadPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5003/api/therapist/patients", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPatients(response.data.patients || []);
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Load patients error:", error);
      setMessage("Failed to load patients and bookings");
    }
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const token = localStorage.getItem("token");
      const profileData = {
        ...profile,
        pricePerSession: parseFloat(profile.pricePerSession) || 50,
        experience: parseInt(profile.experience) || 0
      };
      
      const response = await axios.post("http://localhost:5003/api/therapist/profile", profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage(response.data.message || "Profile saved successfully");
      
      // Reload profile to get updated data
      setTimeout(() => {
        loadProfile();
      }, 1000);
    } catch (error) {
      console.error("Save profile error:", error);
      setMessage(error.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "status-pending",
      confirmed: "status-confirmed",
      completed: "status-completed",
      cancelled: "status-cancelled"
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || ""}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="therapist-profile-page">
      <div className="profile-container">
        <h1>Therapist Dashboard</h1>
        
        {message && (
          <div className="message-banner">
            {message}
          </div>
        )}
        
        <div className="tabs">
          <button 
            className={`tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            My Profile
          </button>
          <button 
            className={`tab ${activeTab === "patients" ? "active" : ""}`}
            onClick={() => setActiveTab("patients")}
          >
            My Patients ({patients.length})
          </button>
        </div>
        
        {activeTab === "profile" && (
          <div className="profile-form-section">
            <h2>Professional Profile</h2>
            <p className="profile-note">
              Note: Profile changes require admin approval. Your profile will be reviewed within 24 hours.
            </p>
            
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="specialization">Specialization *</label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={profile.specialization}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="experience">Years of Experience</label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    value={profile.experience}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="bio">Bio/Description</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Tell us about your background, approach, and expertise..."
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pricePerSession">Price per Session ($)</label>
                  <input
                    type="number"
                    id="pricePerSession"
                    name="pricePerSession"
                    value={profile.pricePerSession}
                    onChange={handleInputChange}
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
                    value={profile.availability}
                    onChange={handleInputChange}
                    placeholder="e.g., Mon-Fri 9am-5pm"
                  />
                </div>
              </div>
              
              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>
        )}
        
        {activeTab === "patients" && (
          <div className="patients-section">
            <h2>My Patients & Bookings</h2>
            
            {patients.length === 0 ? (
              <div className="no-patients">
                <p>You don't have any patients yet.</p>
                <p>Share your profile link to attract new clients!</p>
              </div>
            ) : (
              <div className="patients-grid">
                {patients.map((patient) => (
                  <div key={patient._id} className="patient-card">
                    <div className="patient-header">
                      <h3>{patient.username}</h3>
                      <span className="booking-count">{patient.bookings.length} bookings</span>
                    </div>
                    
                    <div className="bookings-list">
                      {patient.bookings.map((booking) => (
                        <div key={booking._id} className="booking-item">
                          <div className="booking-date">
                            {formatDate(booking.date)} at {formatTime(booking.time)}
                          </div>
                          <div className="booking-status">
                            {getStatusBadge(booking.status)}
                          </div>
                          {booking.notes && (
                            <div className="booking-notes">
                              Notes: {booking.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistProfile;