// fe/src/pages/TherapistDashboard.jsx
import React, { useState, useEffect } from "react";
import {
  getAssignedPatients,
  getRedAlerts,
  getPatientInsights,
  getAppointments,
} from "../utils/api";
import ChatComponent from "../components/ChatComponent";
import "../styles/TherapistDashboard.css";

const TherapistDashboard = () => {
  const [activeTab, setActiveTab] = useState("patients");
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientInsights, setPatientInsights] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === "patients") {
        const data = await getAssignedPatients();
        setPatients(data);
      } else if (activeTab === "alerts") {
        const data = await getRedAlerts();
        setAlerts(data);
      } else if (activeTab === "appointments") {
        const data = await getAppointments();
        setAppointments(data);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const handleViewPatient = async (patient) => {
    setSelectedPatient(patient);
    try {
      const insights = await getPatientInsights(patient._id);
      setPatientInsights(insights);
    } catch (error) {
      console.error("Failed to load insights:", error);
    }
  };

  return (
    <div className="therapist-dashboard">
      <h1>👨‍⚕️ Therapist Dashboard</h1>

      <div className="tab-nav">
        <button
          className={activeTab === "patients" ? "active" : ""}
          onClick={() => setActiveTab("patients")}
        >
          My Patients
        </button>
        <button
          className={activeTab === "alerts" ? "active" : ""}
          onClick={() => setActiveTab("alerts")}
        >
          🚨 Red Alerts
        </button>
        <button
          className={activeTab === "appointments" ? "active" : ""}
          onClick={() => setActiveTab("appointments")}
        >
          Appointments
        </button>
        <button
          className={activeTab === "chat" ? "active" : ""}
          onClick={() => setActiveTab("chat")}
        >
          Chat
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "patients" && (
          <div className="patients-section">
            <div className="patients-grid">
              {patients.map((patient) => (
                <div key={patient._id} className="patient-card">
                  <h3>{patient.username}</h3>
                  <p>Email: {patient.email || "N/A"}</p>
                  <span className={`risk-badge ${patient.riskLevel}`}>
                    {patient.riskLevel} risk
                  </span>
                  <button onClick={() => handleViewPatient(patient)} className="btn-view">
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {selectedPatient && patientInsights && (
              <div className="patient-details-modal">
                <div className="modal-content">
                  <button onClick={() => setSelectedPatient(null)} className="btn-close">✕</button>
                  <h2>{selectedPatient.username} - Insights</h2>
                  <div className="insights-grid">
                    <div className="insight-box">
                      <h4>Total Reflections</h4>
                      <p>{patientInsights.totalReflections}</p>
                    </div>
                    <div className="insight-box">
                      <h4>Risk Level</h4>
                      <p className={`risk-${patientInsights.riskLevel}`}>{patientInsights.riskLevel}</p>
                    </div>
                    <div className="insight-box">
                      <h4>Negative %</h4>
                      <p>{patientInsights.negativePercentage}%</p>
                    </div>
                  </div>
                  <div className="mood-dist">
                    <h4>Mood Distribution</h4>
                    {Object.entries(patientInsights.moodDistribution || {}).map(([mood, count]) => (
                      <div key={mood} className="mood-row">
                        <span>{mood}</span>
                        <span>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
                <p className="alert-user">Patient: {alert.user?.username}</p>
              </div>
            ))}
            {alerts.length === 0 && <p className="empty-state">No active alerts</p>}
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="appointments-section">
            {appointments.map((apt) => (
              <div key={apt._id} className="appointment-card">
                <h4>{apt.user?.username}</h4>
                <p>Date: {new Date(apt.scheduledDate).toLocaleString()}</p>
                <p>Duration: {apt.duration} minutes</p>
                <span className={`status-badge ${apt.status}`}>{apt.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "chat" && selectedPatient && (
          <ChatComponent patientId={selectedPatient._id} />
        )}
      </div>
    </div>
  );
};

export default TherapistDashboard;
