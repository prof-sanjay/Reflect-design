// fe/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  updateUser,
  assignTherapist,
  getAllPrompts,
  createPrompt,
  deletePrompt,
  sendBroadcast,
  getAlerts,
  resolveAlert,
  getAdminAnalytics,
} from "../utils/api";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [prompts, setPrompts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [broadcast, setBroadcast] = useState({ title: "", message: "", priority: "medium" });
  const [newPrompt, setNewPrompt] = useState({ text: "", category: "general" });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === "users") {
        const data = await getAllUsers();
        setUsers(data);
      } else if (activeTab === "prompts") {
        const data = await getAllPrompts();
        setPrompts(data);
      } else if (activeTab === "alerts") {
        const data = await getAlerts();
        setAlerts(data);
      } else if (activeTab === "analytics") {
        const data = await getAdminAnalytics();
        setAnalytics(data);
      } else if (activeTab === "broadcast") {
        // No data loading needed for broadcast form
      } else if (activeTab === "therapists") {
        // No data loading needed for therapists section
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      alert("Failed to load data. Please try again.");
    }
  };

  // Load initial data
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleUpdateUserRole = async (userId, role) => {
    try {
      await updateUser(userId, { role });
      loadData();
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleCreatePrompt = async (e) => {
    e.preventDefault();
    try {
      await createPrompt(newPrompt);
      setNewPrompt({ text: "", category: "general" });
      loadData();
    } catch (error) {
      console.error("Failed to create prompt:", error);
      alert("Failed to create prompt. Please try again.");
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    try {
      await sendBroadcast(broadcast);
      setBroadcast({ title: "", message: "", priority: "medium" });
      alert("Broadcast sent successfully!");
    } catch (error) {
      console.error("Failed to send broadcast:", error);
      alert("Failed to send broadcast. Please try again.");
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await resolveAlert(alertId);
      loadData();
    } catch (error) {
      console.error("Failed to resolve alert:", error);
    }
  };

  const handleDeletePrompt = async (promptId) => {
    try {
      await deletePrompt(promptId);
      loadData();
    } catch (error) {
      console.error("Failed to delete prompt:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>🛡️ Admin Dashboard</h1>

      <div className="tab-nav">
        <button
          className={activeTab === "analytics" ? "active" : ""}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
        <button
          className={activeTab === "prompts" ? "active" : ""}
          onClick={() => setActiveTab("prompts")}
        >
          Prompts
        </button>
        <button
          className={activeTab === "alerts" ? "active" : ""}
          onClick={() => setActiveTab("alerts")}
        >
          Alerts
        </button>
        <button
          className={activeTab === "broadcast" ? "active" : ""}
          onClick={() => setActiveTab("broadcast")}
        >
          Broadcast
        </button>
        <button
          className={activeTab === "therapists" ? "active" : ""}
          onClick={() => setActiveTab("therapists")}
        >
          Therapists
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "analytics" && (
          <div className="analytics-section">
            {analytics ? (
              <>
                <div className="stats-row">
                  <div className="stat-box">
                    <h3>Daily Active Users</h3>
                    <p className="big-number">{analytics.dailyActiveUsers}</p>
                  </div>
                  <div className="stat-box">
                    <h3>Total Users</h3>
                    <p className="big-number">{analytics.totalUsers}</p>
                  </div>
                  <div className="stat-box">
                    <h3>Reflections Today</h3>
                    <p className="big-number">{analytics.reflectionsToday}</p>
                  </div>
                  <div className="stat-box">
                    <h3>Avg Reflections/User</h3>
                    <p className="big-number">{analytics.avgReflectionsPerUser}</p>
                  </div>
                </div>
                <div className="mood-dist">
                  <h3>Mood Distribution (Last 7 Days)</h3>
                  {Object.keys(analytics.moodDistribution).length > 0 ? (
                    Object.entries(analytics.moodDistribution).map(([mood, count]) => (
                      <div key={mood} className="mood-row">
                        <span>{mood}</span>
                        <span>{count}</span>
                      </div>
                    ))
                  ) : (
                    <p>No mood data available</p>
                  )}
                </div>
              </>
            ) : (
              <p>Loading analytics data...</p>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-section">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Risk Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email || "N/A"}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="therapist">Therapist</option>
                      </select>
                    </td>
                    <td>
                      <span className={`risk-badge ${user.riskLevel}`}>{user.riskLevel}</span>
                    </td>
                    <td>
                      <button className="btn-sm">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "prompts" && (
          <div className="prompts-section">
            <form onSubmit={handleCreatePrompt} className="prompt-form">
              <input
                type="text"
                placeholder="Prompt text"
                value={newPrompt.text}
                onChange={(e) => setNewPrompt({ ...newPrompt, text: e.target.value })}
                required
              />
              <select
                value={newPrompt.category}
                onChange={(e) => setNewPrompt({ ...newPrompt, category: e.target.value })}
              >
                <option value="general">General</option>
                <option value="morning">Morning</option>
                <option value="evening">Evening</option>
                <option value="gratitude">Gratitude</option>
                <option value="anxiety">Anxiety</option>
                <option value="growth">Growth</option>
              </select>
              <button type="submit" className="btn-primary">Create Prompt</button>
            </form>

            <div className="prompts-list">
              {prompts.map((prompt) => (
                <div key={prompt._id} className="prompt-item">
                  <div>
                    <p>{prompt.text}</p>
                    <span className="category-badge">{prompt.category}</span>
                  </div>
                  <button onClick={() => handleDeletePrompt(prompt._id)} className="btn-delete-sm">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "alerts" && (
          <div className="alerts-section">
            {alerts.map((alert) => (
              <div key={alert._id} className={`alert-card ${alert.severity}`}>
                <div className="alert-header">
                  <span className="alert-type">{alert.alertType}</span>
                  <span className="alert-severity">{alert.severity}</span>
                </div>
                <p>{alert.description}</p>
                <p className="alert-user">User: {alert.user?.username}</p>
                {!alert.isResolved && (
                  <button onClick={() => handleResolveAlert(alert._id)} className="btn-resolve">
                    Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "broadcast" && (
          <div className="broadcast-section">
            <form onSubmit={handleSendBroadcast} className="broadcast-form">
              <input
                type="text"
                placeholder="Title"
                value={broadcast.title}
                onChange={(e) => setBroadcast({ ...broadcast, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Message"
                value={broadcast.message}
                onChange={(e) => setBroadcast({ ...broadcast, message: e.target.value })}
                required
              />
              <select
                value={broadcast.priority}
                onChange={(e) => setBroadcast({ ...broadcast, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <button type="submit" className="btn-broadcast">Send Broadcast</button>
            </form>
          </div>
        )}
        
        {activeTab === "therapists" && (
          <div className="therapists-section">
            <div className="section-header">
              <h2>Therapist Management</h2>
              <p>Approve and manage therapist profiles</p>
            </div>
            <div className="action-card">
              <h3>Manage Therapist Profiles</h3>
              <p>Review and approve therapist applications, manage their profiles and credentials.</p>
              <a href="/admin/therapists" className="btn-primary">Go to Therapist Management</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
