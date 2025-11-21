import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminTherapistManagement.css";

const AdminTherapistManagement = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTherapists();
  }, []);

  const loadTherapists = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5003/api/therapist/admin/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTherapists(response.data || []);
    } catch (error) {
      console.error("Load therapists error:", error);
      setMessage("Failed to load therapists");
    } finally {
      setLoading(false);
    }
  };

  const approveTherapist = async (therapistId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5003/api/therapist/admin/approve/${therapistId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setMessage(response.data.message || "Therapist approved successfully");
      
      // Update the local state
      setTherapists(prev => 
        prev.map(therapist => 
          therapist._id === therapistId 
            ? { ...therapist, isApproved: true } 
            : therapist
        )
      );
      
      // Reload after a short delay
      setTimeout(() => {
        loadTherapists();
      }, 1000);
    } catch (error) {
      console.error("Approve therapist error:", error);
      setMessage(error.response?.data?.message || "Failed to approve therapist");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (isApproved) => {
    return (
      <span className={`status-badge ${isApproved ? "status-approved" : "status-pending"}`}>
        {isApproved ? "Approved" : "Pending"}
      </span>
    );
  };

  return (
    <div className="admin-therapist-management">
      <div className="management-container">
        <h1>Therapist Management</h1>
        
        {message && (
          <div className="message-banner">
            {message}
          </div>
        )}
        
        <div className="therapists-header">
          <h2>All Therapist Profiles</h2>
          <button className="refresh-btn" onClick={loadTherapists} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
        
        {therapists.length === 0 ? (
          <div className="no-therapists">
            <p>No therapist profiles found.</p>
          </div>
        ) : (
          <div className="therapists-table">
            <div className="table-header">
              <div className="table-cell">Therapist</div>
              <div className="table-cell">Contact</div>
              <div className="table-cell">Specialization</div>
              <div className="table-cell">Experience</div>
              <div className="table-cell">Price</div>
              <div className="table-cell">Status</div>
              <div className="table-cell">Actions</div>
            </div>
            
            {therapists.map((therapist) => (
              <div key={therapist._id} className="table-row">
                <div className="table-cell">
                  <div className="therapist-info">
                    <h3>{therapist.firstName} {therapist.lastName}</h3>
                    <p className="username">@{therapist.user?.username}</p>
                  </div>
                </div>
                
                <div className="table-cell">
                  <p>{therapist.email}</p>
                  <p className="phone">{therapist.phone}</p>
                </div>
                
                <div className="table-cell">
                  <p>{therapist.specialization}</p>
                </div>
                
                <div className="table-cell">
                  <p>{therapist.experience} years</p>
                </div>
                
                <div className="table-cell">
                  <p>${therapist.pricePerSession}/session</p>
                </div>
                
                <div className="table-cell">
                  {getStatusBadge(therapist.isApproved)}
                </div>
                
                <div className="table-cell">
                  {!therapist.isApproved && (
                    <button 
                      className="approve-btn"
                      onClick={() => approveTherapist(therapist._id)}
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTherapistManagement;