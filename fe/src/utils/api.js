// fe/src/utils/api.js
import axios from "axios";

// ========================================
// ✅ BASE URL – Reads from .env
// ========================================
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5003";


// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Get JWT token
const getToken = () => localStorage.getItem("token");

// Auto-inject token
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


// ============================================================================
// ⭐ REFLECTIONS
// ============================================================================
export const fetchReflections = async () => {
  const res = await apiClient.get("/api/reflections");
  return res.data;
};

export const updateReflection = async (data) => {
  const res = await apiClient.post("/api/reflections", data);
  return res.data;
};

export const uploadMedia = async (formData) => {
  const res = await apiClient.post("/api/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};


// ============================================================================
// ⭐ HABITS
// ============================================================================
export const createHabit = async (data) => {
  const res = await apiClient.post("/api/habits", data);
  return res.data;
};

export const getHabits = async () => {
  const res = await apiClient.get("/api/habits");
  return res.data;
};

export const markHabitComplete = async (id, date) => {
  const res = await apiClient.post(`/api/habits/${id}/complete`, { date });
  return res.data;
};

export const updateHabit = async (id, updates) => {
  const res = await apiClient.put(`/api/habits/${id}`, updates);
  return res.data;
};

export const deleteHabit = async (id) => {
  const res = await apiClient.delete(`/api/habits/${id}`);
  return res.data;
};

export const getHabitStats = async () => {
  const res = await apiClient.get("/api/habits/stats");
  return res.data;
};


// ============================================================================
// ⭐ WELLNESS
// ============================================================================
export const getWellnessHistory = async (limit = 30) => {
  const res = await apiClient.get(`/api/wellness?limit=${limit}`);
  return res.data;
};

export const saveWellnessData = async (data) => {
  const res = await apiClient.post("/api/wellness", data);
  return res.data;
};


// ============================================================================
// ⭐ ANALYTICS
// ============================================================================
export const getWeeklyAnalytics = async () => {
  const res = await apiClient.get("/api/analytics/weekly");
  return res.data;
};

export const getMonthlyAnalytics = async () => {
  const res = await apiClient.get("/api/analytics/monthly");
  return res.data;
};

export const getAdminAnalytics = async () => {
  const res = await apiClient.get("/api/analytics/admin");
  return res.data;
};


// ============================================================================
// ⭐ AI
// ============================================================================
export const predictMood = async (text) => {
  const res = await apiClient.post("/api/ai/predict-mood", { text });
  return res.data;
};

export const summarizeReflection = async (text) => {
  const res = await apiClient.post("/api/ai/summarize", { text });
  return res.data;
};

export const getUserInsights = async (userId) => {
  const res = await apiClient.get(`/api/ai/insights/${userId}`);
  return res.data;
};


// ============================================================================
// ⭐ ADMIN
// ============================================================================
export const getAllUsers = async (filters = {}) => {
  const res = await apiClient.get("/api/admin/users", { params: filters });
  return res.data;
};

export const updateUser = async (userId, updates) => {
  const res = await apiClient.put(`/api/admin/users/${userId}`, updates);
  return res.data;
};

export const assignTherapist = async (userId, therapistId) => {
  const res = await apiClient.post("/api/admin/assign-therapist", {
    userId,
    therapistId,
  });
  return res.data;
};

export const createPrompt = async (data) => {
  const res = await apiClient.post("/api/admin/prompts", data);
  return res.data;
};

export const getAllPrompts = async () => {
  const res = await apiClient.get("/api/admin/prompts");
  return res.data;
};

export const updatePrompt = async (id, updates) => {
  const res = await apiClient.put(`/api/admin/prompts/${id}`, updates);
  return res.data;
};

export const deletePrompt = async (id) => {
  const res = await apiClient.delete(`/api/admin/prompts/${id}`);
  return res.data;
};

export const sendBroadcast = async (data) => {
  const res = await apiClient.post("/api/admin/broadcast", data);
  return res.data;
};

export const getAlerts = async () => {
  const res = await apiClient.get("/api/admin/alerts");
  return res.data;
};

export const resolveAlert = async (id) => {
  const res = await apiClient.put(`/api/admin/alerts/${id}/resolve`);
  return res.data;
};


// ============================================================================
// ⭐ THERAPIST
// ============================================================================
export const getAssignedPatients = async () => {
  const res = await apiClient.get("/api/therapist/patients");
  return res.data;
};

export const getPatientMoodHistory = async (id) => {
  const res = await apiClient.get(`/api/therapist/patients/${id}/mood-history`);
  return res.data;
};

export const getPatientInsights = async (id) => {
  const res = await apiClient.get(`/api/therapist/patients/${id}/insights`);
  return res.data;
};

export const getAppointments = async () => {
  const res = await apiClient.get("/api/therapist/appointments");
  return res.data;
};

export const createAppointment = async (data) => {
  const res = await apiClient.post("/api/therapist/appointments", data);
  return res.data;
};

export const updateAppointment = async (id, updates) => {
  const res = await apiClient.put(`/api/therapist/appointments/${id}`, updates);
  return res.data;
};

export const getRedAlerts = async () => {
  const res = await apiClient.get("/api/therapist/alerts");
  return res.data;
};


// ============================================================================
// ⭐ NOTIFICATIONS
// ============================================================================
export const getNotifications = async () => {
  const res = await apiClient.get("/api/notifications");
  return res.data;
};

export const markNotificationAsRead = async (id) => {
  const res = await apiClient.put(`/api/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await apiClient.put("/api/notifications/read-all");
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await apiClient.delete(`/api/notifications/${id}`);
  return res.data;
};

export const deleteUser1 = async (userId) => {
  const token = localStorage.getItem("token");

  await axios.delete(`http://localhost:5003/api/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteUser = async (id) => {
  const res = await fetch(`${"http://localhost:5003"}/users/${id}`, {
    method: "DELETE",
  });
  return res.json();
};


// Export axios instance
export default apiClient;
