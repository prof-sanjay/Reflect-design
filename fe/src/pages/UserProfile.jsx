import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [therapistProfile, setTherapistProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/profile`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setProfile(res.data.user);
        setTherapistProfile(res.data.therapistProfile);
        
        // Initialize form data with user info
        setFormData({
          name: res.data.user.username,
          email: res.data.user.email || "",
          // Add other fields as needed
        });
      } catch (err) {
        console.error("User profile load error:", err);
        alert("Failed to load profile. Please try again.");
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/profile/`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Update profile with new data
      setProfile({...profile, ...res.data.profile});
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
        <h2>User Profile</h2>
        <button onClick={handleEditToggle} className="btn-primary">
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-section">
            <h3>Edit Profile</h3>
            <div className="form-group">
              <label><b>Username:</b></label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label><b>Email:</b></label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      ) : (
        <>
          <div className="profile-section">
            <h3>Basic Information</h3>
            <p><b>Username:</b> {profile.username}</p>
            <p><b>Email:</b> {profile.email || "Not added"}</p>
            <p><b>Role:</b> {profile.role}</p>
            <p><b>Account Status:</b> {profile.isActive ? "Active" : "Inactive"}</p>
            <p><b>Risk Level:</b> 
              <span className={`risk-badge ${profile.riskLevel || 'low'}`}>
                {profile.riskLevel || "Not assessed"}
              </span>
            </p>
          </div>
          
          {profile.role === "therapist" && therapistProfile && (
            <div className="profile-section">
              <h3>Therapist Information</h3>
              <p><b>Approval Status:</b> 
                <span className={therapistProfile.isApproved ? "status-approved" : "status-pending"}>
                  {therapistProfile.isApproved ? "Approved" : "Pending Approval"}
                </span>
              </p>
              {therapistProfile.specialization && (
                <p><b>Specialization:</b> {therapistProfile.specialization}</p>
              )}
              {therapistProfile.experience && (
                <p><b>Years of Experience:</b> {therapistProfile.experience}</p>
              )}
              {therapistProfile.bio && (
                <p><b>Bio:</b> {therapistProfile.bio}</p>
              )}
            </div>
          )}
          
          <div className="profile-section">
            <h3>Account Details</h3>
            <p><b>Member Since:</b> {new Date(profile.createdAt).toLocaleDateString()}</p>
            <p><b>Last Active:</b> {profile.lastActive ? new Date(profile.lastActive).toLocaleDateString() : "Never"}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;